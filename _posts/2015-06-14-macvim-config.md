---

layout: post
title: 我的MacVim的配置
description: 我的MacVim的配置
keywords: vim
category: vim

---

### 打开配置文件
`Edit`-->`Startup Settiongs`

### 我的配置
    "*****************************用户自定义设置*******************************"
    " <C-P>                      --单词补全
    " u [小写]                   --单步复原 [非插入模式]
    " U [大写]                   --整行复原 [非插入模式]

    " :set syntax=cpp            --手动选择语法高亮 [或 :set filetype=cpp]
    " :%!xxd                     --转储二进制文件，以十六进制形式显示
    " :%!xxd -r                  --还原二进制文件

    "********************************设置快捷键*******************************"
    " Ctrl+D              删除当前行
    map <c-d> dda
    imap <c-d> <ESC>dda

    " Ctrl+N              显示缓冲区的下个文件并留在插入模式[插入模式]
    map <c-n> :confirm bnext<CR>A
    imap <c-n> <ESC>:confirm bnext<CR>A



    "********************************设置编码*******************************"
    "设置换行编码
    :set fileformats=unix,dos,mac

    "设置Vim 内部使用的字符编码方式，包括 Vim 的 buffer (缓冲区)、菜单文本、消息文本等
    set encoding=utf-8

    "设置文件编码
    if has("win32")
    set fileencoding=chinese
    else
    set fileencoding=utf-8
    endif

    "Vim 启动时会按照它所列出的字符编码方式逐一探测即将打开的文件的字符编码方式
    "并把fileencoding设置为探测出的编码方式
    set fileencodings=ucs-bom,utf-8,chines

    " 解决菜单乱码
    source $VIMRUNTIME/delmenu.vim
    source $VIMRUNTIME/menu.vim

    " 解决consle输出乱码
    language messages zh_CN.utf-8

    "********************************基本设置******************************"


    colorscheme desert           " 着色模式:灰色背景
    set guifont=Monaco:h14

    set tabstop=4                " 设置tab键的宽度
    set shiftwidth=4             " 换行时行间交错使用4个空格
    set autoindent               " 自动对齐
    set backspace=2              " 设置退格键可用
    set cindent shiftwidth=4     " 自动缩进4空格
    set smartindent              " 智能自动缩进
    set ai!                      " 设置自动缩进
    set nu!                      " 显示行号
    set showmatch                " 显示括号配对情况
    set mouse=a                  " 启用鼠标
    set ruler                    " 右下角显示光标位置的状态行
    set incsearch                " 查找book时，当输入/b时会自动找到
    set hlsearch                 " 开启高亮显示结果
    set incsearch                " 开启实时搜索功能
    set nowrapscan               " 搜索到文件两端时不重新搜索
    set nocompatible             " 关闭兼容模式
    set cursorline               " 突出显示当前行
    set hidden                   " 允许在有未保存的修改时切换缓冲区
    set list                     " 显示Tab符，使用一高亮竖线代替
    set listchars=tab:\|\        " 显示Tab符，使用一高亮竖线代替
    set noswapfile               " 设置无交换区文件"
    set writebackup              " 设置无备份文件
    set nobackup                 " 设置无备份文件
    set autochdir                " 设定文件浏览器目录为当前目录
    set foldmethod=syntax        " 选择代码折叠类型
    set foldlevel=100            " 禁止自动折叠
    set laststatus=2             " 开启状态栏信息
    set cmdheight=2              " 命令行的高度，默认为1，这里设为2
    set showtabline=2            " 设置默认显示标签
    set clipboard+=unnamed       " 与系统公用剪贴板
    set autoread                 " 当文件在外部被修改，自动更新该文件
    set scrolloff=5              " 设定光标离窗口上下边界 5 行时窗口自动滚动
    set guioptions-=T            " 去掉上方工具栏
    set autochdir                " 自动切换到当前目录"
    set autoread                 " 自动检测并加载外部对文件的修改"
    set autowrite                " 自动检测并加载外部对文件的修改"
    set showcmd                  " 命令栏显示命令 "
    set ignorecase smartcase     " 搜索时智能忽略大小写
    syntax enable                " 打开语法高亮
    syntax on                    " 开启文件类型侦测
    if has("gui_running")
        "winpos 20 20            " 指定窗口出现的位置，坐标原点在屏幕左上角
        "set lines=20 columns=90 " 指定窗口大小，lines为高度，columns为宽度
        "set guioptions-=m       " 隐藏菜单栏
        "set guioptions-=T       " 隐藏工具栏
        "set guioptions-=L       " 隐藏左侧滚动条
        "set guioptions-=r       " 隐藏右侧滚动条
        set guioptions+=b        " 显示底部滚动条
        set nowrap               " 设置不自动换行
    endif

    "*****************************设置状态栏*************************************"

    let &statusline=' %t %{&mod?(&ro?"*":"+"):(&ro?"=":" ")} %1*|%* %{&ft==""?"any":&ft} %1*|%* %{&ff} %1*|%* %{(&fenc=="")?&enc:&fenc}%{(&bomb?",BOM":"")} %1*|%* %=%1*|%* 0x%B %1*|%* (%l,%c%V) %1*|%* %L %1*|%* %P'

    "******************************* 引号 && 括号自动匹配*******************************"

    :inoremap ( ()<ESC>i
    :inoremap ) <c-r>=ClosePair(')')<CR>
    :inoremap { {}<ESC>i
    :inoremap } <c-r>=ClosePair('}')<CR>
    :inoremap [ []<ESC>i
    :inoremap ] <c-r>=ClosePair(']')<CR>
    :inoremap < <><ESC>i
    :inoremap > <c-r>=ClosePair('>')<CR>
    :inoremap " ""<ESC>i
    :inoremap ' ''<ESC>i
    :inoremap ` ``<ESC>i

    function ClosePair(char)
        if getline('.')[col('.') - 1] == a:char
            return "\<Right>"
        else
            return a:char
        endif
    endf
