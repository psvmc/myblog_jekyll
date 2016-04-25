---

layout: post
title: 我的vim配色
description: 我的vim配色
keywords: vim,color
categories: vim

---

### 配色文件配置

    " Vim color file
    " Maintainer:	张剑<183518918@qq.com>
    " Last Change:	2015-07-01

    set bg=dark
    hi clear
    if exists("syntax_on")
    	syntax reset
    endif

    let colors_name = "zjdark"

    hi Normal		guifg=#c0c0c0 guibg=#333333						ctermfg=gray ctermbg=black
    hi ErrorMsg		guifg=#ffffff guibg=#287eff						ctermfg=white ctermbg=lightblue
    hi Visual		guifg=#8080ff guibg=#eeeeee		gui=reverse				ctermfg=lightblue ctermbg=fg cterm=reverse
    hi VisualNOS	guifg=#8080ff guibg=#eeeeee		gui=reverse,underline	ctermfg=lightblue ctermbg=fg cterm=reverse,underline
    hi Todo			guifg=#d14a14 guibg=#1248d1						ctermfg=red	ctermbg=darkblue
    hi Search		guifg=#90fff0 guibg=#2050d0						ctermfg=white ctermbg=darkblue cterm=underline term=underline
    hi IncSearch	guifg=#b0ffff guibg=#2050d0							ctermfg=darkblue  ctermbg=gray

    hi SpecialKey		guifg=cyan			ctermfg=darkcyan
    hi Directory		guifg=cyan			ctermfg=cyan
    hi Title			guifg=magenta gui=none ctermfg=magenta cterm=bold
    hi WarningMsg		guifg=red			ctermfg=red
    hi WildMenu			guifg=yellow guibg=black ctermfg=yellow ctermbg=black cterm=none term=none
    hi ModeMsg			guifg=#22cce2		ctermfg=lightblue
    hi MoreMsg			ctermfg=darkgreen	ctermfg=darkgreen
    hi Question			guifg=green gui=none ctermfg=green cterm=none
    hi NonText			guifg=#22cce2		ctermfg=darkblue 

    hi StatusLine	guifg=#22cce2 guibg=#444444 gui=none		ctermfg=blue ctermbg=gray term=none cterm=none
    hi StatusLineNC	guifg=black guibg=darkgray gui=none		ctermfg=black ctermbg=gray term=none cterm=none
    hi VertSplit	guifg=black guibg=darkgray gui=none		ctermfg=black ctermbg=gray term=none cterm=none

    hi Folded	guifg=#808080 guibg=#000040			ctermfg=darkgrey ctermbg=black cterm=bold term=bold
    hi FoldColumn	guifg=#808080 guibg=#000040			ctermfg=darkgrey ctermbg=black cterm=bold term=bold
    hi LineNr	guifg=orange guibg=#222222			ctermfg=green cterm=none

    hi DiffAdd	guibg=#333333	ctermbg=darkblue  term=none cterm=none
    hi DiffChange	guibg=darkmagenta ctermbg=magenta cterm=none
    hi DiffDelete	ctermfg=blue ctermbg=cyan gui=bold guifg=Blue guibg=DarkCyan
    hi DiffText	cterm=bold ctermbg=red gui=bold guibg=Red

    hi Cursor	guifg=black guibg=yellow ctermfg=black ctermbg=yellow
    hi lCursor	guifg=black guibg=white ctermfg=black ctermbg=white


    hi Comment	guifg=#80a0ff ctermfg=darkred
    hi Constant	ctermfg=magenta guifg=#ffa0a0 cterm=none
    hi Special	ctermfg=brown guifg=Orange cterm=none gui=none
    hi Identifier	ctermfg=cyan guifg=#40ffff cterm=none
    hi Statement	ctermfg=yellow cterm=none guifg=#ffff60 gui=none
    hi PreProc	ctermfg=magenta guifg=#ff80ff gui=none cterm=none
    hi type		ctermfg=green guifg=#60ff60 gui=none cterm=none
    hi Underlined	cterm=underline term=underline
    hi Ignore	guifg=bg ctermfg=bg

    hi Pmenu guifg=#c0c0c0 guibg=#404080
    hi PmenuSel guifg=#c0c0c0 guibg=#2050d0
    hi PmenuSbar guifg=blue guibg=darkgray
    hi PmenuThumb guifg=#c0c0c0
 
 
### 使用方法
 复制上面的内容保存为`zjdark.vim`,然后放在`macvim`或`gvim`的`安装目录`下的`colors文件夹`下，`重启vim`选择该主题即可
 

     
