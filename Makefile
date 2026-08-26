SHELL := /bin/sh
.DEFAULT_GOAL := help

REMOTE ?= origin
MAIN_BRANCH ?= main
MSG ?=

.PHONY: help install dev check build verify require-msg update publish

help:
	@printf '%s\n' \
		'make dev                    启动本地开发服务' \
		'make verify                 运行检查并构建静态站点' \
		'make update MSG="说明"      提交更改并推送当前分支' \
		'make publish                将干净的当前提交发布到 main'

install:
	npm install

dev:
	npm run dev

check:
	npm run check

build:
	npm run build:site

verify: check build

require-msg:
	@if [ -z "$(strip $(MSG))" ]; then \
		echo '缺少提交说明，请使用 make update MSG="说明"'; \
		exit 2; \
	fi

update: require-msg verify
	git add -A
	@if git diff --cached --quiet; then \
		echo '没有需要提交的更改，继续同步当前分支。'; \
	else \
		git commit -m "$(MSG)"; \
	fi
	git push -u "$(REMOTE)" HEAD

publish: verify
	@if [ -n "$$(git status --porcelain)" ]; then \
		echo '工作区仍有未提交修改，请先运行 make update MSG="说明"'; \
		exit 2; \
	fi
	git push "$(REMOTE)" HEAD:"$(MAIN_BRANCH)"
