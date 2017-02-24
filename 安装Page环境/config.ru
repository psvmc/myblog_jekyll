require "bundler/setup"
require 'rack/contrib/try_static'
Bundler.require(:default)

WEBHOOK_TOKEN = ENV['WEBHOOK_TOKEN']

app = Proc.new do |env|
  request = Rack::Request.new(env)
  response = Rack::Response.new
  path_info = request.path_info

  if request.content_type =~ /application\/json/
    params = JSON.parse(request.body.read)
  else
    params = request.params
  end

  if request.post? && params['token'] == WEBHOOK_TOKEN
    repo_url = params['repository']['web_url'] rescue nil
    if repo_url
      archive_url = "#{repo_url}/git/archive/master"
      puts "--> 生成中..."
      puts `jekyll build`
      `rm -rf $HOME/_posts; curl -s -L -o $TMPDIR/archive.zip #{archive_url}; unzip -qo -d $HOME $TMPDIR/archive.zip; cd $HOME; jekyll build;chmod -R 777 $HOME`
      puts "--> 完成."
    else
      STDERR.puts "--> error: no url field found in params: #{params}"
    end

    ['200', { 'Conetent-Type' => 'application/json;charset=utf-8' }, ['ok']]
  else
    ['403', { 'Conetent-Type' => 'application/json;charset=utf-8' }, [{ error: 'webhook token mismatch!' }.to_json]]
  end
  
end

jekyll = Rack::Jekyll.new(auto: true)

use Rack::Deflater

# use Rack::TryStatic,
#   :root => "_site",
#   :urls => %w[/],
#   :try  => ['index.html', '/index.html']

run Rack::URLMap.new('/' => jekyll, '/_' => app)
