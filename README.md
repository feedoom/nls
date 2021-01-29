<img src="https://s3.ax1x.com/2021/01/29/yCvBIU.png" div align=right />
  
<div align='center'><b><font size=1 color='blue'>美化是第一生产力！</font></b></div> 


`nls` 是用 node.js 编写的命令行工具，用来代替 Linux 下的 `ls` 命令

* 拥有颜色高亮，图标显示等功能

## 命令:
```shell
// 带图标显示
$ nls -i
```
<img src="https://s3.ax1x.com/2021/01/29/yCv0aT.png" div align=right />

```shell
// 显示文件夹的背景色
$ nls -i -fb
```
<img src="https://s3.ax1x.com/2021/01/29/yCvsG4.png" div align=right />

```shell
// 显示隐藏文件
$ nls -i -fb -a
```
<img src="https://s3.ax1x.com/2021/01/29/yCvriF.png" div align=right />

```shell
// 显示多个文件夹
$ nls -i -a dir1/ dir2/
```
<img src="https://s3.ax1x.com/2021/01/29/yCvyRJ.png" div align=right />

```shell
// 显示文件的详细信息
$ nls -i -fb -a -l
```
<img src="https://s3.ax1x.com/2021/01/29/yCv6z9.png" div align=right />


## 安装
尽量使用较新的 node

ubuntu:
```
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt update
apt install nodejs
```

npm 安装:
```
npm install -g @feedoom/nls
```

本地安装:
```
git clone https://gitee.com/feedoom/nls
cd nls
npm install
npm install -g .
```

显示字体图标需要 [nerd-fonts 字体](https://github.com/ryanoasis/nerd-fonts)

## 替代 ls
```
alias ls='nls -i'
alias ll='nls -i -l'
```

## npm dependencies
* [chalk](https://github.com/chalk/chalk)
* [cli-columns](https://github.com/shannonmoeller/cli-columns)
* [fs-mode-to-string](https://github.com/AndreasPizsa/fs-mode-to-string)
