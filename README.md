# QQ Hidden Reactions

QQNT Toolbox 的精简回应补丁：补回本地隐藏 emoji，并把 **999 灰脸**放到同一个隐藏区底部。

- 点击给消息添加回应，再次选择可取消；可以继续添加，也可用于其他消息。
- 没有实验弹窗、确认步骤或自动撤销计时。
- 网络失败可重试；短时间重复请求会去重。

## 安装

需要已安装 **LiteLoaderQQNT** 和 **QQNT Toolbox 0.10.12**，以及 Python 3。此仓库不负责安装加载器或修改 QQ 主程序。

1. 完全退出 QQ。
2. 下载本仓库源码，运行：

   ```powershell
   python install.py "你的 LiteLoaderQQNT\plugins\QQNT-Toolbox"
   ```

3. 重开 QQ，在 Toolbox 中开启“娱乐互动 → 移除表情回应限制”。
4. 打开群消息的“贴表情”面板，向下滚动到隐藏区，选择最后的灰色笑脸。

安装器会先备份原插件文件。仅支持上述插件版本，检测不符时停止，不覆盖文件。

## 恢复

完全退出 QQ 后运行：

```powershell
python install.py "你的 LiteLoaderQQNT\plugins\QQNT-Toolbox" --restore
```

然后重新启动 QQ。恢复保留原插件配置。

## 验证范围

灰脸参数为 `emojiType=1`、`emojiId=999`。已在 Windows QQ 9.9.30-48762 的实际收发环境中确认默认灰色笑脸效果。其他客户端、未来版本或服务器行为可能不同。

测试只需 Node.js，无需安装 npm 依赖：

```sh
npm test
```

## 来源与许可

基于 [MeiYongAI/QQNT-Toolbox](https://github.com/MeiYongAI/QQNT-Toolbox) 的回应实现修改，遵循 **AGPL-3.0-only**，详见 [NOTICE.md](NOTICE.md) 和 [LICENSE](LICENSE)。仓库只包含补丁源码和文档。
