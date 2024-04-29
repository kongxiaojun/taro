#!/bin/bash

# 版本号
CURRENT_VERSION=$(node -p 'require("./package.json").version')
echo "CURRENT_VERSION=${CURRENT_VERSION}"

# 分支
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "CURRENT_BRANCH=${CURRENT_BRANCH}"

GITHUB_REPOSITORY="handsomeliuyang/taro"

# Check git tag
GET_API_URL="https://api.github.com/repos/${GITHUB_REPOSITORY}/git/ref/tags/v${CURRENT_VERSION}"
http_status_code=$(curl -LI $GET_API_URL -o /dev/null -w '%{http_code}\n' -s -H "Authorization: token ${GITHUB_TOKEN}")
echo "http_status_code=${http_status_code}"
if [ "$http_status_code" -ne "404" ]; then
    exists_tag=true
else
    exists_tag=false
fi
echo "exists_tag=${exists_tag}"
#
## ------------------ If git tag already exists, skip -------------
#if [ "$exists_tag" = false ]; then
#    echo "Git tag does not exist, continuing..."
#fi
#
## Bootstrap project
#pnpm -r install --frozen-lockfile
#
### Git stash
#git add .
#git stash
#
## Create git tag
#git tag -a "v${CURRENT_VERSION}" -m "Release v${CURRENT_VERSION}"
#git push origin "v${CURRENT_VERSION}"
#
## ------------------ publish -------------
#pnpm publish --registry=https://registry.npmjs.org/ --publish-branch=${CURRENT_BRANCH} -r

