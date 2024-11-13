# 引用依赖：
- 引用shadcnUI
    - npm install shadcn-ui
    - npx shadcn@latest init -d

- 引用Clerk：
    - 参见官网： https://dashboard.clerk.com/


# 开发流程:
## 开发注意:
1. 不要轻易修改package.json的版本依赖. 应用了最新Next.js15版本

## 页面:
1. V0网站; 根据图片附近和AI描述生成React的代码
2. 复制到tsx中,直接Cursor对话完善

## TODO:
1. 提价AI页面✅
2. 价格页面-验证支付
    -stripe配置测试环境
    - 测试支付成功
    - 成功后修改账号级别
    - 保存数据
3. logo
4. 广告置顶-付费
5. 博客功能-付费增加博客推荐
6. 底部页面
7. 国际化语言功能
8. 法律条款和隐私政策
9. 社交账号关联
10. Card详情页面
11. 详情的社交媒体分享功能
12. 404页面,500页面



## 功能描述:
2024年11月11日.
1. 对标导航网站: https://www.toolify.ai/zh/most-used
2. 增加分类功能
3. 需要挖掘有效关键词;

2024年11月10日. 
1. 增加主页面的AIwith.me的主页;
2. 修正Clerk的登录注册; 注意注册时候发送邮件的表头;
