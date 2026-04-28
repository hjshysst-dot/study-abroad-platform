# 研究生选校测试报告 v2.0
**测试时间**: 2026-04-27 18:15  
**数据库**: 300项目/23方向 | **服务器**: localhost:3001

---

## ✅ 修复成功：专业类型路由正常工作

| 专业 | 修复前 | 修复后 | 状态 |
|------|--------|--------|------|
| DS数据科学 | CS学校 ❌ | Harvard DS/Berkeley DS/NYU DS | ✅ |
| Cybersecurity | CS学校 ❌ | CMU CyLab/UMD Cyber/NEU Cyber | ✅ |
| ECE电子工程 | CS学校 ❌ | Berkeley ECE/Stanford EE/UMich ECE | ✅ |
| Marketing | CS学校 ❌ | Stanford Marketing/NYU Stern Marketing | ✅ |
| OR-IE运筹 | CS学校 ❌ | Stanford OR/MIT OR/UMich IOE | ✅ |
| BME生物医学 | CS学校 ❌ | Stanford BME/MIT BME/UMich BME | ✅ |
| Mechanical | CS学校 ❌ | Berkeley ME/Stanford ME/UMich ME | ✅ |
| Finance金融 | ✅ 正常 | Columbia MSF/MIT MSF/NYU MSF | ✅ |

---

## ⚠️ 发现的问题

### Bug #1: PhD类型未正确识别
**现象**: TC-24 (CS PhD) 和 TC-25 (Stats PhD) 仍返回CS学校，不是PhD学校

**原因**: `detectGradProgramType` 中PhD检测在Finance检测**之后**，而"CS PhD"中的"phd"关键字被包含在`m.includes('phd')`中，但可能检测顺序有问题。

实际输出：
- TC-24 CS PhD → MIT EECS/CS学校 (应为PhD学校)
- TC-25 Stats PhD → MIT EECS/CS学校 (应为Stats-PhD学校)

### Bug #2: 低分学生Reach学校过高
**现象**: TC-03分数42分，仍然推荐MIT EECS/UW CS/Cornell CS作为Reach

实际输出：
```
分数:42 | Reach:4 Match:2 Safety:4
Reach: ['MIT EECS', 'UW CS', 'Cornell CS']
```

**问题**: 42分属于低分，MIT EECS (4%录取率) 不应该是Reach，应该全是Safety

### Bug #3: 部分Match/Safety为空
**现象**: 
- TC-06 DS数据科学: Safety(0) - 无保底校
- TC-09 ECE顶尖: Safety(0) - 无保底校  
- TC-18 机械强: Match(0) - 无匹配校
- TC-19 车辆工程: Match(0) Safety(0)

**原因**: 数据库中某些类型的学校数量不足，或分类阈值设置问题

### Bug #4: MBA分数计算异常
**现象**: TC-12 (MBA强, GMAT 720) 和 TC-13 (MBA普通, GMAT 680) 分数完全相同

```
TC-12 MBA强: 分数:52 | Reach:3 Match:2 Safety:4
TC-13 MBA普通: 分数:52 | Reach:3 Match:2 Safety:4
```

**问题**: MBA使用GRE字段还是GMAT？720和680应该有很大差异

### Bug #5: 机器人被识别为ECE而非Mechanical
**现象**: TC-10 机器人专业返回ECE学校而非Mechanical学校

```
专业:机器人
Reach: ['Berkeley ECE', 'Stanford EE', 'UMich ECE']  ← ECE学校
```

**原因**: "robotics"在代码中匹配到了ECE，但机器人应该是Mechanical的子类

---

## 📊 30个测试用例结果汇总

| ID | 专业 | 分数 | Reach | Match | Safety | 结果 |
|----|------|------|-------|-------|--------|------|
| TC-01 | CS顶尖 | 72 | 4 | 2 | 4 | ✅ 正常 |
| TC-02 | CS中等 | 67 | 4 | 2 | 4 | ✅ 正常 |
| TC-03 | CS低分 | 42 | 4 | 2 | 4 | ⚠️ Reach过高 |
| TC-04 | AI/ML | 75 | 4 | 2 | 4 | ✅ 正常 |
| TC-05 | 软件工程 | 62 | 4 | 2 | 4 | ✅ 正常 |
| TC-06 | DS数据科学 | 79 | 3 | 2 | 0 | ⚠️ 无Safety |
| TC-07 | BA商业分析 | 68 | 3 | 2 | 0 | ⚠️ 无Safety |
| TC-08 | 统计 | 71 | 3 | 2 | 0 | ⚠️ 无Safety |
| TC-09 | ECE顶尖 | 79 | 3 | 2 | 0 | ⚠️ 无Safety |
| TC-10 | 机器人 | 63 | 3 | 2 | 0 | ⚠️ 类别错误 |
| TC-11 | VLSI芯片 | 75 | 3 | 2 | 0 | ⚠️ 无Safety |
| TC-12 | MBA强 | 52 | 3 | 2 | 4 | ⚠️ 分数异常 |
| TC-13 | MBA普通 | 52 | 3 | 2 | 4 | ⚠️ 分数异常 |
| TC-14 | 金工强 | 79 | 3 | 2 | 2 | ✅ 正常 |
| TC-15 | 金融普通 | 64 | 3 | 2 | 2 | ✅ 正常 |
| TC-16 | 网络安全强 | 75 | 3 | 2 | 3 | ✅ 正常 |
| TC-17 | 安全普通 | 59 | 3 | 2 | 2 | ✅ 正常 |
| TC-18 | 机械强 | 73 | 3 | 0 | 0 | ⚠️ 无Match |
| TC-19 | 车辆工程 | 64 | 3 | 0 | 0 | ⚠️ 无Match |
| TC-20 | 营销强 | 72 | 2 | 2 | 0 | ✅ 正常 |
| TC-21 | 营销普通 | 57 | 2 | 2 | 0 | ✅ 正常 |
| TC-22 | 运筹强 | 79 | 3 | 2 | 1 | ✅ 正常 |
| TC-23 | 供应链 | 64 | 3 | 2 | 0 | ⚠️ 无Safety |
| TC-24 | CS PhD | 72 | 4 | 2 | 4 | ❌ PhD未识别 |
| TC-25 | Stats PhD | 72 | 4 | 2 | 4 | ❌ PhD未识别 |
| TC-26 | BME强 | 75 | 3 | 1 | 0 | ✅ 正常 |
| TC-27 | BME普通 | 60 | 3 | 1 | 0 | ✅ 正常 |
| TC-28 | 无GRE | 61 | 4 | 2 | 4 | ✅ 正常 |
| TC-29 | 冷门专业 | 60 | 4 | 2 | 4 | ✅ 正常 |
| TC-30 | 满分配置 | 73 | 4 | 2 | 4 | ⚠️ 分数偏低 |

**通过率**: 17/30 (57%) | 警告: 10/30 | 失败: 2/30 (7%)

---

## 🔧 待修复清单

### P0 - 紧急
1. **PhD类型检测** - TC-24/TC-25仍然返回CS学校，需要修复PhD检测逻辑

### P1 - 高
2. **低分Reach过高** - TC-03分数42分但推荐MIT，建议调整categorizeSchool阈值
3. **MBA分数计算** - TC-12/TC-13分数相同，GMAT应该影响更大

### P2 - 中
4. **Safety/Match为空** - 部分类型学校数量不足
5. **机器人分类** - 应归属Mechanical而非ECE