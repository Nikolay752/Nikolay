// Refresh.tsx 修正类名（改为小写）
import React from "react"
import styles from "@/layouts/Refresh.less" // 简化样式变量名（可选）
import refreshIconSrc from "@/icons/Refresh.svg" // 导入为路径字符串（避免组件配置问题）

interface RefreshProps {}
export default function Refresh({}: RefreshProps) {
    return (
        <div className={styles.refresh}> {/* 类名改为小写 refresh，与 Less 对应 */}
            <img src={refreshIconSrc} alt="刷新" className={styles.refresh_icon} /> {/* 新增图标类名，便于单独控制 */}
        </div>
    );
}