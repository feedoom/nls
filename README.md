尽量使用较新的 node

ubuntu:
```
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt update
apt install nodejs
```

本地安装：
```
git clone https://gitee.com/feedoom/nls
cd nls
npm install
npm install -g .
```

命令:
```shell
nls
// 输出隐藏文件
nls -a
// 输出文件的详细信息
nls -l
// 输出文件的图标
nls -i
```
