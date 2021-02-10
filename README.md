<div align="center">
<h1>nls</h1>

`nls` 是一个漂亮的 `ls` 工具

*美化是第一生产力！*

</div>

![nls logo](picture/nls_logo.png)

---

**nls** 是用 `node` 编写的命令行工具，用来替代 Unix 和 Linux 的 `ls` 命令，用不同的颜色和图标区分不同的文件和数据。

---

<h1>命令参数</h1>

- **-i**: 显示图标
- **-fb**: 文件夹显示背景色
- **-l**: 显示文件的详细信息和属性
- **-a**: 显示隐藏的文件
- **-d**: 只显示文件夹
- **-s**: 文件按字母顺序排序再按`隐藏文件 -> 文件夹 -> 软链接 -> 文件`排序
- **-g**: 按 .gitignore 文件隐藏文件
- **-r**: 递归显示目录内容
- **-t**: 递归显示文件树
- **-I 'regexp'**: 根据参数后的正则表达式，忽略文件，比如 `-I '*.class'`，后面有效果图


### TODO
- [ ] 完善 `-t` 参数功能，现在的文件树是默认添加了 `-s` 参数进行排序再生成的

---

<h1>效果图</h1>

- `-i -fb -a` 参数
<div align="center">
<img src="./picture/nls_fb_a.png">
</div>

- `-s` 参数
<div align="center">
<img src="./picture/nls_s_i_fb.png">
</div>

- `-l` 参数
<div align="center">
<img src="./picture/nls_fb_a_l.png">
</div>

- `-g` 参数
<div align="center">
<img src="./picture/nls_g.png">
</div>

- `-r` 参数
<div align="center">
<img src="./picture/nls_r.png">
</div>

- `-I` 参数
<div align="center">
<img src="./picture/nls_I.png">
</div>

- `-t` 参数
<div align="center">
<img src="./picture/nls_t.png">
<img src="./picture/nls_l_t.png">
</div>

---

<h1>安装</h1>

nls 可以安装再 macOS 和 Linux.

### node.js 安装
需要安装 node.js

    $ curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
    $ sudo apt update
    $ apt install nodejs

### npm 安装

    $ npm install -g @feedoom/nls

### 本地安装

    $ git clone https://gitee.com/feedoom/nls
    $ cd nls
    $ npm install
    $ npm install -g .

### nerd-fonts 字体
显示字体图标需要 [nerd-fonts 字体](https://github.com/ryanoasis/nerd-fonts)

### 配色
想用自己的配色，可修改`./lib/color.js`，再本地安装

---

### 替代 ls
```
alias ls='nls -i'
alias ll='nls -i -l'
```

### npm dependencies
* [chalk](https://github.com/chalk/chalk)
* [cli-columns](https://github.com/shannonmoeller/cli-columns)
* [fs-mode-to-string](https://github.com/AndreasPizsa/fs-mode-to-string)

### 灵感
* [exa](https://github.com/ogham/exa)
* [color-ls](https://github.com/monsterkodi/color-ls)
* [colorls](https://github.com/husnulhamidiah/colorls)
