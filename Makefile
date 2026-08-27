SHELL := /bin/sh
.DEFAULT_GOAL := help

REMOTE ?= origin
MAIN_BRANCH ?= main
MSG ?=

.PHONY: help install dev check build verify mark-verified verify-if-needed require-msg require-clean update publish

VERIFIED_HEAD_FILE := $(shell git rev-parse --git-path blog-verified-head)

help:
	@printf '%s\n' \
		'make dev                    启动本地开发服务' \
		'make verify                 运行检查并构建静态站点' \
		'make update MSG="说明"      提交更改并推送当前分支' \
		'make publish                将当前提交发布到 main（已验证则跳过检查）'

install:
	npm install

dev:
	npm run dev

check:
	npm run check

build:
	npm run build:site

verify: check build
	@$(MAKE) mark-verified

mark-verified:
	@git rev-parse HEAD > "$(VERIFIED_HEAD_FILE)"

verify-if-needed:
	@if [ -f "$(VERIFIED_HEAD_FILE)" ] && \
		[ "$$(cat "$(VERIFIED_HEAD_FILE)")" = "$$(git rev-parse HEAD)" ]; then \
		echo '当前提交已经验证，跳过重复检查。'; \
	else \
		$(MAKE) verify; \
	fi

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
	@$(MAKE) mark-verified

require-clean:
	@if [ -n "$$(git status --porcelain)" ]; then \
		echo '工作区仍有未提交修改，请先运行 make update MSG="说明"'; \
		exit 2; \
	fi

publish: require-clean
	@$(MAKE) verify-if-needed
	git push "$(REMOTE)" HEAD:"$(MAIN_BRANCH)"
