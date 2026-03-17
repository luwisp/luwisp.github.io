SHELL := /bin/bash
# 这里替换成自己的路径
QT_CMAKE := $(HOME)/Qt/6.10.2/wasm_singlethread/bin/qt-cmake
EMSHELL := /mnt/d/Code/emsdk/emsdk_env.sh
# 默认编译 Linux 端
all: linux

linux:
	mkdir -p $(CURDIR)/build/linux
	cd build/linux && cmake ../.. -DCMAKE_BUILD_TYPE=Release
	cmake --build build/linux -j $$(nproc)
	
wasm:
	mkdir -p $(CURDIR)/build/wasm
	source $(EMSHELL) && \
	cd build/wasm && \
	$(QT_CMAKE) ../.. -DCMAKE_BUILD_TYPE=Release && \
	cmake --build . -j $$(nproc)
	
clean:
	rm -rf build

run-linux:
	$(CURDIR)/build/linux/apphomepage
run-wasm:
	python3 -m http.server --directory $(CURDIR)/build/wasm 8080
	
.PHONY: all linux wasm clean
