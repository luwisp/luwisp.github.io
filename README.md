一个使用qt for webassembly构建的博客

编译为桌面版本：
```
cd build/linux && cmake code && make
```

编译为wasm版本，这里qt-cmake要替换为自己的路径:
```
cd build/wasm && ~/Qt/6.10.2/wasm_singlethread/bin/qt-cmake code && make
```

