// Bilingual chapter content for the Ethereum Whitepaper learning system.
// Each chapter: { id, title{zh,en}, subtitle{zh,en}, sections:[{type, ...}] , quiz, demo? }
// Section types: heading, paragraph, list, code, tip, keypoint, blockquote
window.CHAPTERS = [
  {
    id: "ch01",
    title: { zh: "引言：从比特币到以太坊", en: "Intro: From Bitcoin to Ethereum" },
    subtitle: { zh: "为什么我们需要一条新的链？", en: "Why do we need a new chain?" },
    sections: [
      { type: "heading", level: 2, zh: "1.1 比特币解决了什么？", en: "1.1 What did Bitcoin solve?" },
      { type: "paragraph",
        zh: "2009 年中本聪发布的比特币，第一次让一群互不信任的计算机就「谁拥有多少钱」达成一致 —— 不依赖任何银行或政府。它的核心创新是：用一条公开的、不可篡改的账本（区块链），加上工作量证明（PoW）来防止任何人作弊。",
        en: "In 2009, Bitcoin let mutually-distrusting computers agree on 'who owns what' without any bank. Its core innovation is a public, tamper-evident ledger (the blockchain) protected by Proof of Work." },
      { type: "keypoint",
        zh: "比特币 = 去中心化的电子现金。它的链上只能记录「转账」这一件事。",
        en: "Bitcoin = decentralized digital cash. Its chain natively records only one kind of action: transfers." },
      { type: "heading", level: 2, zh: "1.2 比特币的瓶颈", en: "1.2 Bitcoin's bottleneck" },
      { type: "paragraph",
        zh: "比特币内置了一种叫 Script 的脚本语言，可以做简单的多签、时间锁等。但它故意被设计成「非图灵完备」——不能循环、不能保留状态，没法表达稍复杂的逻辑（比如众筹、链上拍卖、自动分红）。",
        en: "Bitcoin has a tiny scripting language (Script) for things like multisig. It is deliberately not Turing-complete — no loops, no persistent state — so any logic more complex than 'pay-to-X' is hard or impossible." },
      { type: "list",
        zh: [
          "缺少图灵完备性：不能写循环和递归。",
          "缺少状态：每笔 UTXO 要么全花，要么全不花，无法记 '余额'。",
          "缺少区块链感知：脚本看不到当前区块号、时间等。",
          "缺少价值感知：脚本不能根据收到的金额做条件分支。"
        ],
        en: [
          "Not Turing-complete: no loops or recursion.",
          "No persistent state: UTXOs are spent atomically; you can't store a 'balance'.",
          "Not blockchain-aware: scripts can't read block height or timestamps directly.",
          "Not value-aware: scripts can't branch on the amount received."
        ] },
      { type: "heading", level: 2, zh: "1.3 以太坊的提案", en: "1.3 The Ethereum proposal" },
      { type: "paragraph",
        zh: "以太坊不是「更好的比特币」，而是一台「世界计算机」：在区块链上跑一个图灵完备的虚拟机（EVM），任何人都能上传程序（智能合约），让它们按规则自动执行、不可被任何人单方面停止。",
        en: "Ethereum is not 'a better Bitcoin' but a 'world computer': a Turing-complete VM (the EVM) on top of a blockchain. Anyone can upload programs (smart contracts) that run autonomously and cannot be unilaterally stopped." },
      { type: "tip",
        zh: "类比：比特币像一台只会算账的计算器；以太坊像一台公共的、所有人共享的服务器。",
        en: "Analogy: Bitcoin is a calculator that only does arithmetic; Ethereum is a public server everyone shares." }
    ],
    quiz: [
      { q: { zh: "比特币脚本的主要局限是？", en: "Which is NOT a limitation of Bitcoin Script?" },
        options: {
          zh: ["不是图灵完备", "没有持久状态", "看不到区块号", "无法转账 BTC"],
          en: ["Not Turing-complete", "No persistent state", "Can't see block height", "Can't transfer BTC"]
        },
        answer: 3,
        explain: {
          zh: "脚本恰恰是用来授权转账 BTC 的，这是它能做的事；前三项才是它的限制。",
          en: "Script's job is exactly to authorize BTC transfers; the first three are its limitations."
        } },
      { q: { zh: "以太坊和比特币最本质的区别？", en: "What's the fundamental difference between Ethereum and Bitcoin?" },
        options: {
          zh: ["更快的出块", "通缩的代币", "图灵完备的智能合约", "免费的交易"],
          en: ["Faster blocks", "Deflationary supply", "Turing-complete smart contracts", "Free transactions"]
        },
        answer: 2,
        explain: {
          zh: "以太坊在链上引入了图灵完备的 VM，这才让任意业务逻辑成为可能。",
          en: "Ethereum brought a Turing-complete VM on-chain, enabling arbitrary business logic."
        } }
    ]
  },

  {
    id: "ch02",
    title: { zh: "状态转换系统", en: "The State Transition System" },
    subtitle: { zh: "区块链 = 状态 + 一组合法的状态变更", en: "Blockchain = State + valid state transitions" },
    sections: [
      { type: "paragraph",
        zh: "白皮书把区块链定义为一个「状态转换系统」(state transition system)。这个抽象非常关键，下面所有的概念（账户、合约、交易）都建立在它之上。",
        en: "The whitepaper models a blockchain as a state transition system. Every later concept (accounts, contracts, transactions) builds on this abstraction." },
      { type: "heading", level: 2, zh: "2.1 状态 (State) 是什么？", en: "2.1 What is 'state'?" },
      { type: "paragraph",
        zh: "在比特币里，状态就是「当前所有未花费的输出（UTXO）的集合」。在以太坊里，状态是「所有账户的集合 + 每个账户的余额/代码/存储」。",
        en: "In Bitcoin, state = the set of unspent transaction outputs (UTXOs). In Ethereum, state = all accounts plus each account's balance / code / storage." },
      { type: "heading", level: 2, zh: "2.2 状态转换函数", en: "2.2 The state transition function" },
      { type: "paragraph",
        zh: "形式上，存在一个函数 APPLY(S, TX) → S'，输入是「当前状态 S + 一笔交易 TX」，输出是「新状态 S'」（如果交易非法就返回错误）。整个链就是不断地把这个函数应用到上一个状态上。",
        en: "Formally there is a function APPLY(S, TX) → S' that takes the current state S and a transaction TX and returns a new state S' (or error). The chain is just this function applied over and over." },
      { type: "code", lang: "text",
        content:
`S0 ── APPLY(TX1) ──▶ S1 ── APPLY(TX2) ──▶ S2 ── APPLY(TX3) ──▶ S3 ...
                                                              │
                                          这就是当前区块链状态 / Current chain state` },
      { type: "heading", level: 2, zh: "2.3 比特币里的 APPLY", en: "2.3 APPLY in Bitcoin" },
      { type: "list",
        zh: [
          "检查每个输入指向的 UTXO 确实存在且属于发送者。",
          "检查解锁脚本能解开锁定脚本。",
          "把这些 UTXO 从状态里删掉。",
          "为每个输出加入新的 UTXO。"
        ],
        en: [
          "Check each input references an existing UTXO owned by the sender.",
          "Verify the unlocking script satisfies the locking script.",
          "Remove those UTXOs from the state.",
          "Add new UTXOs for each output."
        ] },
      { type: "tip",
        zh: "重点：状态变更必须可被任何节点独立验证、结果完全一致 —— 这就是共识的基础。",
        en: "Key idea: every node must independently reproduce the same state transition. That's what 'consensus' really means." }
    ],
    quiz: [
      { q: { zh: "在以太坊中，「状态」主要由什么构成？", en: "In Ethereum, what makes up the 'state'?" },
        options: {
          zh: ["UTXO 集合", "所有账户（余额、代码、存储）", "所有矿工的算力", "所有区块的哈希"],
          en: ["Set of UTXOs", "All accounts (balance, code, storage)", "Miner hashrates", "All block hashes"]
        },
        answer: 1,
        explain: {
          zh: "以太坊用账户模型，状态 = 所有账户的快照。",
          en: "Ethereum uses the account model; state = a snapshot of all accounts."
        } },
      { q: { zh: "APPLY(S, TX) 在交易非法时应该？", en: "What should APPLY(S, TX) do for an invalid TX?" },
        options: {
          zh: ["回滚到创世状态", "返回错误，不改变状态", "把矿工的余额清零", "随机改一个状态"],
          en: ["Reset to genesis", "Return error and leave state unchanged", "Zero out the miner balance", "Mutate state randomly"]
        },
        answer: 1,
        explain: {
          zh: "非法交易直接丢弃，状态保持不变。",
          en: "Invalid TXs are rejected; state is untouched."
        } }
    ]
  },

  {
    id: "ch03",
    title: { zh: "挖矿与工作量证明", en: "Mining and Proof of Work" },
    subtitle: { zh: "谁来决定下一个区块？", en: "Who gets to decide the next block?" },
    sections: [
      { type: "heading", level: 2, zh: "3.1 双花问题", en: "3.1 The double-spend problem" },
      { type: "paragraph",
        zh: "如果没有银行做仲裁，Alice 把同一个比特币同时发给 Bob 和 Charlie，谁该收下？这就是「双花」问题。比特币的回答是：让全网做一场「记账权拍卖」，谁愿意烧最多电算 SHA-256，谁就有资格写下一页账本。",
        en: "Without a bank, what stops Alice from paying the same coin to both Bob and Charlie? Bitcoin's answer: hold an auction for the right to write the next page — whoever burns the most SHA-256 hashes wins." },
      { type: "heading", level: 2, zh: "3.2 哈希难题", en: "3.2 The hash puzzle" },
      { type: "paragraph",
        zh: "矿工不断改变区块里的一个随机数 nonce，直到整个区块的哈希值小于某个目标值（即开头有足够多的 0）。这件事没有捷径，只能暴力试。",
        en: "Miners tweak a nonce in the block header until the block's hash falls below a target (i.e. starts with enough zeros). There is no shortcut — only brute force." },
      { type: "code", lang: "text",
        content:
`while True:
    nonce += 1
    h = sha256(block_header + nonce)
    if h < TARGET:           # 难度目标 / difficulty target
        break                # 我赢了！ / I win!` },
      { type: "heading", level: 2, zh: "3.3 最长链 = 真链", en: "3.3 Longest chain = real chain" },
      { type: "paragraph",
        zh: "节点之间可能短暂地看到不同的最新区块（分叉），规则是：永远跟随累计工作量最大的那条链。这样，要想推翻一笔已经被埋很深的交易，攻击者必须独自重新算出比全网更多的哈希，几乎不可能。",
        en: "Nodes may briefly see different tips (a fork). The rule: always follow the chain with the most accumulated work. To rewrite a deeply buried transaction, an attacker must out-hash the entire network alone — practically impossible." },
      { type: "blockquote",
        zh: "白皮书原话（意译）：节点表达对历史的认同的方式，就是把算力投入到那条历史的延续上。",
        en: "From the paper: nodes express their belief in a history by extending it with their hashpower." }
    ],
    demo: { type: "pow" },
    quiz: [
      { q: { zh: "PoW 解决的核心问题是？", en: "What core problem does PoW solve?" },
        options: {
          zh: ["让交易免费", "决定谁有权写下一个区块", "压缩区块大小", "保护用户隐私"],
          en: ["Make TXs free", "Decide who writes the next block", "Compress block size", "Protect user privacy"]
        },
        answer: 1,
        explain: {
          zh: "PoW 是一种「领导者选举」机制 —— 算力最大的赢得本轮记账权。",
          en: "PoW is a leader-election mechanism — most hashpower wins the round."
        } },
      { q: { zh: "面对分叉，节点应跟随？", en: "When there's a fork, nodes follow…" },
        options: {
          zh: ["最先看到的链", "区块数最多的链", "累计工作量最大的链", "矿工最多的链"],
          en: ["The first one they saw", "The one with most blocks", "The one with most cumulative work", "The one with most miners"]
        },
        answer: 2,
        explain: {
          zh: "「最长链」更准确的说法是「累计 PoW 最大的链」。",
          en: "'Longest chain' really means 'heaviest chain by cumulative work'."
        } }
    ]
  },

  {
    id: "ch04",
    title: { zh: "Merkle 树", en: "Merkle Trees" },
    subtitle: { zh: "用一个根哈希守护千万条数据", en: "One root hash to rule them all" },
    sections: [
      { type: "paragraph",
        zh: "Merkle 树是一种把大量数据「压缩」成一个 32 字节哈希的结构。区块头里只存这个根哈希，但任何一条数据是否被包含、是否被改过，都能用很少的信息验证。",
        en: "A Merkle tree compresses many pieces of data into a single 32-byte hash. The block header stores only the root, but anyone can prove inclusion or detect tampering with a tiny proof." },
      { type: "heading", level: 2, zh: "4.1 怎么构造？", en: "4.1 How is it built?" },
      { type: "list",
        zh: [
          "把每条数据先做哈希，得到「叶子」节点。",
          "相邻两个叶子拼起来再哈希，得到上一层节点。",
          "一直往上合并，最后只剩一个节点 —— 这就是 Merkle Root。"
        ],
        en: [
          "Hash each item to form 'leaf' nodes.",
          "Concatenate adjacent pairs and hash them to get the parent.",
          "Repeat upward until one node remains — the Merkle Root."
        ] },
      { type: "code", lang: "text",
        content:
`                Root = H(H12 || H34)
                 /              \\
         H12=H(H1||H2)     H34=H(H3||H4)
          /     \\            /      \\
       H1=H(A) H2=H(B)    H3=H(C)  H4=H(D)
         A       B           C        D     ← 叶子 / leaves` },
      { type: "heading", level: 2, zh: "4.2 为什么有用？", en: "4.2 Why is it useful?" },
      { type: "list",
        zh: [
          "改 1 个字节 → 根哈希就变 → 一眼看穿篡改。",
          "证明「数据 X 在树里」只需 O(log N) 个兄弟哈希，叫 Merkle Proof。",
          "轻客户端（手机钱包）不用下载整条链，只下区块头 + Merkle Proof 就能验证交易。"
        ],
        en: [
          "Change 1 byte → root changes → tampering is obvious.",
          "Proving 'X is in the tree' needs only O(log N) sibling hashes (a Merkle proof).",
          "Light clients (mobile wallets) verify TXs by downloading only block headers + a Merkle proof."
        ] },
      { type: "tip",
        zh: "在以太坊里，状态树（Patricia Merkle Trie）让任何账户的余额都能用几十个哈希被证明。",
        en: "In Ethereum, the Patricia Merkle Trie lets you prove any account balance with just a handful of hashes." }
    ],
    demo: { type: "merkle" },
    quiz: [
      { q: { zh: "如果叶子 C 的内容改了 1 个字节，会发生什么？", en: "If leaf C changes by 1 byte, what happens?" },
        options: {
          zh: ["只有 H3 变", "H3 和 H34 变", "H3、H34、Root 都变", "什么都不变"],
          en: ["Only H3 changes", "H3 and H34 change", "H3, H34, and Root all change", "Nothing changes"]
        },
        answer: 2,
        explain: {
          zh: "改动会沿着路径一路传到根。",
          en: "The change propagates all the way up to the root."
        } },
      { q: { zh: "证明「叶子 B 在树里」需要提供哪些哈希？", en: "What do you need to prove leaf B is in the tree?" },
        options: {
          zh: ["H1 和 H34", "H2 和 H34", "H1 和 H3", "整棵树"],
          en: ["H1 and H34", "H2 and H34", "H1 and H3", "The whole tree"]
        },
        answer: 0,
        explain: {
          zh: "需要兄弟节点 H1 和叔节点 H34，加上 B 自己就能算到 Root。",
          en: "You need sibling H1 and uncle H34, plus B itself, to recompute Root."
        } }
    ]
  },

  {
    id: "ch05",
    title: { zh: "比特币脚本的局限", en: "Limitations of Bitcoin Scripting" },
    subtitle: { zh: "为什么必须发明 EVM？", en: "Why we had to invent the EVM" },
    sections: [
      { type: "paragraph",
        zh: "上面我们已经知道，比特币脚本不是图灵完备的。这一节我们具体看看，正因为这些限制，哪些应用根本写不出来。",
        en: "We've already seen Bitcoin Script is not Turing-complete. Here we look at concrete applications that simply cannot be built on it." },
      { type: "heading", level: 2, zh: "5.1 缺少图灵完备", en: "5.1 No Turing-completeness" },
      { type: "paragraph",
        zh: "没有循环就没法做迭代算法（比如复利、滚动平均）。而且循环带来停机问题：恶意脚本可能让全网节点卡死。比特币用「禁掉循环」的办法回避；以太坊则用「按步收费（Gas）」的办法解决。",
        en: "No loops = no iterative algorithms (compounding interest, moving averages). Loops also create the halting problem — a malicious script could freeze every node. Bitcoin avoids it by banning loops; Ethereum solves it by charging per step (Gas)." },
      { type: "heading", level: 2, zh: "5.2 缺少状态", en: "5.2 No state" },
      { type: "paragraph",
        zh: "UTXO 是一次性的：要么全花、要么不动。无法表达「账户余额随时间累加」这样的概念，所以多签托管、抵押池、链上拍卖都很难自然实现。",
        en: "UTXOs are one-shot: spend it whole or not at all. Concepts like 'an account balance that grows over time' are hard to express, making custody pools, on-chain auctions, etc. unnatural." },
      { type: "heading", level: 2, zh: "5.3 缺少价值与上下文盲", en: "5.3 No value awareness, no context" },
      { type: "list",
        zh: [
          "脚本不能根据自己收到多少 BTC 作判断（无法表达「至少 1 BTC 才执行」）。",
          "脚本看不到当前区块号、时间戳，难以做时间条件。",
          "脚本只能验证 yes/no，不能调用别的脚本，不能组合。"
        ],
        en: [
          "A script can't branch on the amount received ('only run if ≥ 1 BTC').",
          "It can't see block height or timestamp, making time conditions awkward.",
          "It only outputs yes/no — scripts can't call other scripts; no composability."
        ] },
      { type: "keypoint",
        zh: "总结：比特币脚本是「锁」，以太坊合约是「程序」。锁只决定能不能开，程序可以做任何事。",
        en: "Bitcoin Script is a *lock*; an Ethereum contract is a *program*. Locks just open or stay shut; programs can do anything." }
    ],
    quiz: [
      { q: { zh: "比特币脚本为什么不允许循环？", en: "Why does Bitcoin Script ban loops?" },
        options: {
          zh: ["浪费硬盘", "避免停机问题导致全网卡死", "省 Gas", "因为没用"],
          en: ["Wastes disk", "Avoids the halting problem freezing nodes", "Saves gas", "Because they're useless"]
        },
        answer: 1,
        explain: {
          zh: "禁掉循环是最简单的「保证脚本一定能在有限步内结束」的办法。",
          en: "Banning loops is the simplest way to guarantee termination."
        } },
      { q: { zh: "以太坊用什么机制解决停机问题？", en: "How does Ethereum handle the halting problem?" },
        options: {
          zh: ["也禁掉循环", "按步收费 Gas", "限制脚本长度", "用 AI 判断"],
          en: ["Also bans loops", "Charges Gas per step", "Limits script length", "Uses AI"]
        },
        answer: 1,
        explain: {
          zh: "每一步操作都消耗 Gas，Gas 用完就强制停机。",
          en: "Every step burns Gas; when Gas runs out, execution halts."
        } }
    ]
  },

  {
    id: "ch06",
    title: { zh: "以太坊的设计哲学", en: "Ethereum Design Philosophy" },
    subtitle: { zh: "五个支配性原则", en: "Five guiding principles" },
    sections: [
      { type: "paragraph",
        zh: "白皮书第二部分明确列出了以太坊在设计上要追求的几个原则。理解它们能帮你看懂后面所有的取舍。",
        en: "The whitepaper lists a few principles Ethereum tries to optimize for. Knowing them helps explain every later trade-off." },
      { type: "heading", level: 2, zh: "6.1 简洁 (Simplicity)", en: "6.1 Simplicity" },
      { type: "paragraph",
        zh: "宁可在执行效率上吃亏，也要让协议简单、文档清晰 —— 让普通程序员能完全读懂。",
        en: "Even at the cost of runtime efficiency, the protocol should be simple enough for an average programmer to understand end-to-end." },
      { type: "heading", level: 2, zh: "6.2 通用性 (Universality)", en: "6.2 Universality" },
      { type: "paragraph",
        zh: "不内置特定业务（不直接支持「域名」「彩票」「保险」等）。它只提供一个图灵完备的脚本语言，所有具体业务都让用户自己用合约写出来。",
        en: "Don't bake specific applications into the protocol (no built-in 'name service', 'lottery', etc.). Provide a Turing-complete language and let users write whatever they want." },
      { type: "heading", level: 2, zh: "6.3 模块化 (Modularity)", en: "6.3 Modularity" },
      { type: "paragraph",
        zh: "协议应该由可独立替换的模块构成 —— 比如 EVM、共识、网络层 —— 一处升级不必牵动全身。",
        en: "The protocol should be made of independently replaceable modules (EVM, consensus, networking), so upgrading one doesn't touch the others." },
      { type: "heading", level: 2, zh: "6.4 不歧视 (Non-discrimination)", en: "6.4 Non-discrimination" },
      { type: "paragraph",
        zh: "协议本身不限制任何具体用途。如果用户愿意付足够 Gas，他想在链上跑什么都行 —— 哪怕是「赌博」「无聊小游戏」「打印 Hello world」。",
        en: "The protocol does not restrict any use case. If the user pays enough gas, they can run anything — gambling, toy games, even 'Hello world'." },
      { type: "heading", level: 2, zh: "6.5 简约协议 (Agility / minimalism)", en: "6.5 Agility / minimalism" },
      { type: "paragraph",
        zh: "尽量在「上层（合约）」做事，让「底层（协议）」保持冻结。底层每改一次都是世界级事件。",
        en: "Push functionality up into contracts; keep the base protocol frozen — every base-layer change is a planet-scale event." },
      { type: "tip",
        zh: "这套哲学正是后来 EIP（以太坊改进提案）、L2、模块化区块链运动的思想源头。",
        en: "These principles seeded later movements: EIPs, L2 rollups, modular blockchains." }
    ],
    quiz: [
      { q: { zh: "「不歧视」原则意味着？", en: "What does 'non-discrimination' mean?" },
        options: {
          zh: ["所有交易免费", "协议不审查用途，只收 Gas", "矿工不得选择交易", "不允许 NFT"],
          en: ["All TXs are free", "Protocol doesn't censor use cases; just charge gas", "Miners can't pick TXs", "NFTs are forbidden"]
        },
        answer: 1,
        explain: {
          zh: "你只要付得起 Gas，协议层就不管你干什么。",
          en: "If you pay the gas, the base layer doesn't care what you do."
        } },
      { q: { zh: "「通用性」意味着以太坊不会做什么？", en: "Per 'universality', Ethereum won't…" },
        options: {
          zh: ["内置 ENS 域名", "内置代币标准", "内置任何特定业务", "内置随机数"],
          en: ["Build in ENS", "Build in token standard", "Build in any specific application", "Build in randomness"]
        },
        answer: 2,
        explain: {
          zh: "通用性 = 不把任何具体业务固化进协议。",
          en: "Universality = no specific application is baked into the protocol."
        } }
    ]
  },

  {
    id: "ch07",
    title: { zh: "以太坊账户：EOA 与合约", en: "Ethereum Accounts: EOA & Contract" },
    subtitle: { zh: "两种账户，一套规则", en: "Two account types, one rule set" },
    sections: [
      { type: "paragraph",
        zh: "以太坊抛弃了比特币的 UTXO 模型，改用「账户模型」。一个账户就是一段以 20 字节地址索引的状态。",
        en: "Ethereum drops the UTXO model in favour of an account model. An account is a piece of state indexed by a 20-byte address." },
      { type: "heading", level: 2, zh: "7.1 EOA：外部账户", en: "7.1 EOA — Externally Owned Account" },
      { type: "list",
        zh: [
          "由一对私钥/公钥控制（地址 = 公钥的 keccak256 后 20 字节）。",
          "没有代码。",
          "只能被「人」通过签名来主动发起交易。",
          "示例：你 MetaMask 里的那个账号。"
        ],
        en: [
          "Controlled by a private/public key pair (address = last 20 bytes of keccak256(pubkey)).",
          "Has no code.",
          "Can only originate transactions when a human signs.",
          "Example: your MetaMask account."
        ] },
      { type: "heading", level: 2, zh: "7.2 合约账户", en: "7.2 Contract account" },
      { type: "list",
        zh: [
          "由代码控制（部署时把字节码写进去）。",
          "拥有自己的存储空间（一个 key→value 映射）。",
          "不能主动发起交易，只能被别人调用后「反应」。",
          "示例：Uniswap 池子、ERC-20 代币合约。"
        ],
        en: [
          "Controlled by code (set when deployed).",
          "Owns a key→value storage of its own.",
          "Can't originate transactions; only reacts when called.",
          "Examples: a Uniswap pool, an ERC-20 token contract."
        ] },
      { type: "heading", level: 2, zh: "7.3 账户的四个字段", en: "7.3 Four fields per account" },
      { type: "code", lang: "text",
        content:
`Account {
  nonce:        交易计数器 / TX counter (防重放 / replay protection)
  balance:      余额 (单位 wei)
  storageRoot:  存储树的 Merkle Root (仅合约用)
  codeHash:     代码的哈希 (EOA = 空哈希)
}` },
      { type: "tip",
        zh: "判断一个地址是 EOA 还是合约：看 codeHash 是不是空哈希（keccak256(\"\")）。",
        en: "How to tell EOA vs contract: check whether codeHash equals keccak256(\"\")." }
    ],
    quiz: [
      { q: { zh: "合约账户能主动发起交易吗？", en: "Can a contract originate a transaction?" },
        options: {
          zh: ["可以，任何时候", "可以，但要付 Gas", "不行，只能被调用后响应", "可以，但需要矿工允许"],
          en: ["Yes, any time", "Yes, if it pays gas", "No, it only reacts when called", "Yes, with miner approval"]
        },
        answer: 2,
        explain: {
          zh: "所有交易的「发起者」必须是 EOA，合约只能在被调用过程里再调别人。",
          en: "Every TX originates from an EOA; contracts can only make sub-calls from within an existing call."
        } },
      { q: { zh: "nonce 的作用是？", en: "What is nonce for?" },
        options: {
          zh: ["记录余额", "防止同一笔交易被重放", "存储合约状态", "计算 Gas"],
          en: ["Track balance", "Prevent replay of the same TX", "Hold contract state", "Compute gas"]
        },
        answer: 1,
        explain: {
          zh: "nonce 每发一笔交易就 +1，旧 nonce 的签名再也无效。",
          en: "Nonce increments after each TX; old nonces are no longer valid."
        } }
    ]
  },

  {
    id: "ch08",
    title: { zh: "交易与消息", en: "Transactions & Messages" },
    subtitle: { zh: "外部世界进入区块链的唯一入口", en: "The only gateway from the outside world to the chain" },
    sections: [
      { type: "heading", level: 2, zh: "8.1 一笔交易的字段", en: "8.1 Fields of a transaction" },
      { type: "code", lang: "text",
        content:
`Transaction {
  nonce      : 发送者已发交易数
  gasPrice   : 你愿意为每单位 gas 付多少 wei
  gasLimit   : 这笔交易最多能烧多少 gas
  to         : 接收方地址 (空 = 创建合约)
  value      : 转给 to 的 wei 数
  data       : 调用数据（函数选择器 + 参数）
  v, r, s    : 发送者签名
}` },
      { type: "heading", level: 2, zh: "8.2 交易的三种形态", en: "8.2 Three flavours of TX" },
      { type: "list",
        zh: [
          "纯转账：to 是 EOA，data 为空。",
          "合约调用：to 是合约，data = 函数选择器 + 参数。",
          "合约创建：to 为空，data = 合约字节码 + 构造参数。"
        ],
        en: [
          "Plain transfer: to = EOA, data empty.",
          "Contract call: to = contract, data = function selector + args.",
          "Contract creation: to is empty, data = contract bytecode + constructor args."
        ] },
      { type: "heading", level: 2, zh: "8.3 内部消息 (Message)", en: "8.3 Internal messages" },
      { type: "paragraph",
        zh: "合约 A 在执行中调用合约 B —— 这不是新的交易，而是一条「消息」(message)。Message 没有签名，但和交易共用 EVM 执行逻辑：也有 sender、to、value、data、gasLimit。",
        en: "When contract A calls contract B mid-execution, that isn't a new TX — it's a 'message'. Messages have no signature but otherwise share the same fields as TXs and run through the same EVM logic." },
      { type: "tip",
        zh: "「交易」一定由 EOA 发起；「消息」由合约在执行中生成。两者最终都让 EVM 跑一段字节码。",
        en: "A 'transaction' always starts from an EOA; a 'message' is generated by a contract during execution. Both end up running EVM bytecode." }
    ],
    quiz: [
      { q: { zh: "gasLimit 字段的作用是？", en: "What does gasLimit do?" },
        options: {
          zh: ["规定每 gas 多少钱", "限制本交易最多烧多少 gas", "限制区块的总 gas", "矿工奖励"],
          en: ["Sets price per gas", "Caps gas this TX can burn", "Caps gas of the block", "Miner reward"]
        },
        answer: 1,
        explain: {
          zh: "gasLimit 是本交易的上限，gasPrice 才是单价。",
          en: "gasLimit caps this TX; gasPrice sets the per-unit cost."
        } },
      { q: { zh: "合约 A → 合约 B 的调用叫？", en: "A contract A calling contract B is a…" },
        options: {
          zh: ["新的交易", "内部消息 (message)", "RPC", "Gas refund"],
          en: ["New transaction", "Internal message", "RPC call", "Gas refund"]
        },
        answer: 1,
        explain: {
          zh: "合约间调用是消息，不会上链单独存在，但完全走 EVM 执行流程。",
          en: "Inter-contract calls are messages — not separate TXs — but they use the same EVM execution path."
        } }
    ]
  },

  {
    id: "ch09",
    title: { zh: "以太坊状态转换函数", en: "Ethereum State Transition Function" },
    subtitle: { zh: "一笔交易里到底发生了什么？", en: "What really happens inside a TX?" },
    sections: [
      { type: "paragraph",
        zh: "白皮书给出了一段「伪代码级」的步骤描述 —— 把一笔交易拆开看，会发现节点要做以下事情：",
        en: "The whitepaper gives a near-pseudocode breakdown of a single TX. Step by step:" },
      { type: "code", lang: "text",
        content:
`APPLY(S, TX):
  1. 校验 TX 格式 (nonce 对、签名有效、gasLimit×gasPrice 不超余额)
  2. 计算手续费 fee = gasLimit × gasPrice，从发送者扣
  3. 设 gas = gasLimit; nonce += 1
  4. 转账 value 从 sender 到 to
  5. 如果 to 是合约，执行合约代码:
       - 每条指令消耗一定 gas
       - 若 gas 用尽 → 全部回滚，但 fee 不退
       - 若执行成功 → 状态更新
  6. 剩余 gas × gasPrice 退回 sender
  7. 已用 gas × gasPrice 给矿工` },
      { type: "heading", level: 2, zh: "9.1 关键性质", en: "9.1 Key properties" },
      { type: "list",
        zh: [
          "原子性：执行中任何报错 → 状态全部回滚，但已花的 gas 不退。",
          "确定性：同样输入 → 任何节点算出同样结果（这是共识的前提）。",
          "可审计：每一步都能事后重放、独立验证。"
        ],
        en: [
          "Atomic: any error → state fully reverts, but the gas paid is gone.",
          "Deterministic: same input → every node produces the same output (required for consensus).",
          "Auditable: every step can be replayed and independently verified."
        ] },
      { type: "tip",
        zh: "「执行失败也要收费」听起来不友好，但正是它防止了攻击者用永远失败的交易让全网白白做功。",
        en: "Charging for failed TXs sounds unfriendly, but it's exactly what stops attackers from spamming guaranteed-to-fail calls." }
    ],
    quiz: [
      { q: { zh: "交易执行中 gas 用尽时？", en: "When a TX runs out of gas…" },
        options: {
          zh: ["状态保留，gas 退回", "状态回滚，gas 不退", "下一区块继续", "矿工赔偿用户"],
          en: ["State kept, gas refunded", "State reverts, gas burnt", "Continues next block", "Miner pays user back"]
        },
        answer: 1,
        explain: {
          zh: "回滚保护用户合约不被部分执行；但 gas 已被矿工干活了，所以不退。",
          en: "Reverting protects users; the miner already did the work, so gas isn't refunded."
        } },
      { q: { zh: "执行成功后剩余 gas 怎么办？", en: "What happens to leftover gas after success?" },
        options: {
          zh: ["全归矿工", "退回 sender", "烧掉", "存到下一笔"],
          en: ["Goes to miner", "Refunded to sender", "Burnt", "Saved for next TX"]
        },
        answer: 1,
        explain: {
          zh: "用户付的是预付款 (gasLimit × gasPrice)，没花完的退回。",
          en: "User prepaid gasLimit × gasPrice; unused portion is refunded."
        } }
    ]
  },

  {
    id: "ch10",
    title: { zh: "以太坊虚拟机 EVM", en: "The Ethereum Virtual Machine" },
    subtitle: { zh: "一台跑在全球每个节点上的小机器", en: "A tiny machine running on every node on earth" },
    sections: [
      { type: "heading", level: 2, zh: "10.1 EVM 的三块内存", en: "10.1 The three memories of the EVM" },
      { type: "list",
        zh: [
          "Stack（栈）：32 字节项，最多 1024 项，最常用。",
          "Memory（内存）：线性、临时，调用结束就清空。",
          "Storage（存储）：持久化的 key→value（每个 key 32 字节），写入是 Gas 消耗最高的操作之一。"
        ],
        en: [
          "Stack: 32-byte words, max 1024 items — the workhorse.",
          "Memory: linear, temporary, wiped after the call.",
          "Storage: persistent key→value (32-byte each); writing here is one of the most expensive ops."
        ] },
      { type: "heading", level: 2, zh: "10.2 一段示例字节码", en: "10.2 A snippet of bytecode" },
      { type: "code", lang: "text",
        content:
`PUSH1 0x05      ; 把 5 压栈
PUSH1 0x03      ; 把 3 压栈
ADD             ; 弹出两个相加 → 栈顶 = 8
PUSH1 0x00      ; 把 0 压栈 (要写到 storage 位 0)
SSTORE          ; 把栈上的 8 写进 storage[0]` },
      { type: "heading", level: 2, zh: "10.3 Solidity 与字节码", en: "10.3 Solidity vs bytecode" },
      { type: "paragraph",
        zh: "我们不直接写 EVM 字节码 —— Solidity / Vyper 等高级语言会把代码编译成上面那种指令序列，然后被打包成 deploy 交易。",
        en: "We don't write EVM bytecode by hand. High-level languages like Solidity or Vyper compile to those instruction sequences, then get packaged into a deploy TX." },
      { type: "keypoint",
        zh: "EVM 是「完全沙箱」：合约只能访问自己的内存、存储、被传入的参数；想读别的合约必须显式调用。",
        en: "The EVM is fully sandboxed: a contract sees only its own memory, storage and call inputs; reading another contract requires an explicit call." }
    ],
    demo: { type: "evm" },
    quiz: [
      { q: { zh: "下面哪种内存是「持久」的？", en: "Which of these is persistent?" },
        options: {
          zh: ["Stack", "Memory", "Storage", "Calldata"],
          en: ["Stack", "Memory", "Storage", "Calldata"]
        },
        answer: 2,
        explain: {
          zh: "只有 Storage 在交易结束后还保留 —— 因此写 Storage 也最贵。",
          en: "Only Storage survives a TX, which is why writing to it is the most expensive op."
        } },
      { q: { zh: "EVM 的栈一次最多放多少项？", en: "How deep can the EVM stack get?" },
        options: { zh: ["256", "512", "1024", "无限制"], en: ["256", "512", "1024", "Unlimited"] },
        answer: 2,
        explain: {
          zh: "1024 项，超过会抛 StackOverflow 异常。",
          en: "1024 items max; beyond that triggers a stack-overflow error."
        } }
    ]
  },

  {
    id: "ch11",
    title: { zh: "Gas 与费用机制", en: "Gas & Fees" },
    subtitle: { zh: "为什么链上一切都要明码标价？", en: "Why everything on-chain has a price tag" },
    sections: [
      { type: "paragraph",
        zh: "Gas 是 EVM 里每一步操作的「计量单位」。它的作用有两个：①让停机问题可解 —— gas 用完必停；②让滥用资源者付出代价 —— 想刷垃圾交易就交钱。",
        en: "Gas measures every step in the EVM. It serves two purposes: (1) make the halting problem solvable — out of gas = forced halt; (2) make spam expensive — using shared resources costs money." },
      { type: "heading", level: 2, zh: "11.1 常见操作的 Gas 价目", en: "11.1 Sample gas costs" },
      { type: "code", lang: "text",
        content:
`ADD/SUB/MUL ............ 3-5 gas        ; 算术
SLOAD .................. 2100 gas       ; 读 storage
SSTORE (新写入) ........ 20000 gas      ; 写 storage 槽
SSTORE (改已有) ........ 5000 gas
CREATE (创建合约) ...... 32000 gas + 代码大小
CALL (调用别的合约) .... 700 gas + 参数
LOG ................... 375 gas / topic` },
      { type: "heading", level: 2, zh: "11.2 用户付多少钱？", en: "11.2 How much does the user pay?" },
      { type: "paragraph",
        zh: "总费用 = gasUsed × gasPrice。gasPrice 通常以 gwei 为单位（1 gwei = 10⁻⁹ ETH）。用户其实是在出价竞标 —— 矿工优先选 gasPrice 高的交易。",
        en: "Total fee = gasUsed × gasPrice. gasPrice is usually expressed in gwei (1 gwei = 10⁻⁹ ETH). It's an auction: miners pick the highest-paying TXs first." },
      { type: "tip",
        zh: "EIP-1559（2021）后费用模型分成 baseFee（自动调整、烧掉）+ tip（给矿工）。白皮书只描述了最早的 gasPrice 模型。",
        en: "Since EIP-1559 (2021), fees split into baseFee (auto-tuned, burnt) + tip (to the miner). The whitepaper describes the original gasPrice model only." }
    ],
    demo: { type: "gas" },
    quiz: [
      { q: { zh: "为什么 SSTORE 比 ADD 贵几千倍？", en: "Why is SSTORE thousands of times more expensive than ADD?" },
        options: {
          zh: ["矿工讨厌它", "需要永久占用全网节点的硬盘", "需要新私钥", "代码更长"],
          en: ["Miners hate it", "It permanently uses every node's disk", "Requires a new key", "Longer code"]
        },
        answer: 1,
        explain: {
          zh: "写一次 storage = 让全球每一个节点都永久存这条数据，成本必须反映在价格里。",
          en: "Writing storage means every node on earth stores it forever; the price has to reflect that."
        } },
      { q: { zh: "用户实际付的费用 = ?", en: "Actual fee paid by the user = ?" },
        options: {
          zh: ["gasLimit × gasPrice", "gasUsed × gasPrice", "gasLimit + gasPrice", "balance × gasPrice"],
          en: ["gasLimit × gasPrice", "gasUsed × gasPrice", "gasLimit + gasPrice", "balance × gasPrice"]
        },
        answer: 1,
        explain: {
          zh: "实际只按用到的 gasUsed 付费，剩余的预付款会退回。",
          en: "You're only charged for gas actually used; the rest is refunded."
        } }
    ]
  },

  {
    id: "ch12",
    title: { zh: "应用：代币、DAO、衍生品", en: "Applications: Tokens, DAOs, Derivatives" },
    subtitle: { zh: "白皮书描绘的未来 —— 大部分已经实现", en: "The future the whitepaper sketched — mostly real today" },
    sections: [
      { type: "heading", level: 2, zh: "12.1 子货币 / 代币", en: "12.1 Sub-currencies / tokens" },
      { type: "paragraph",
        zh: "在一个合约里维护一个 `mapping(address ⇒ uint256) balanceOf`，再写一个 transfer 函数 —— 你就发了一种新代币。这就是后来 ERC-20 的雏形。",
        en: "A contract holding `mapping(address ⇒ uint256) balanceOf` plus a transfer function — you've issued a token. This is the seed of ERC-20." },
      { type: "code", lang: "text",
        content:
`contract MiniToken {
  mapping(address => uint256) public balanceOf;

  function transfer(address to, uint256 amount) external {
    require(balanceOf[msg.sender] >= amount);
    balanceOf[msg.sender] -= amount;
    balanceOf[to]         += amount;
  }
}` },
      { type: "heading", level: 2, zh: "12.2 金融衍生品", en: "12.2 Financial derivatives" },
      { type: "paragraph",
        zh: "白皮书举了一个例子：一份「以 ETH 抵押的稳定币」合约。Alice 抵押 ETH，按预言机喂的 ETH/USD 价格借出等值的 USD 代币。这正是后来 MakerDAO 的核心思想。",
        en: "The paper sketches a stablecoin: Alice locks ETH and mints USD-pegged tokens based on an oracle-fed ETH/USD price. This is the core of MakerDAO." },
      { type: "heading", level: 2, zh: "12.3 去中心化自治组织 DAO", en: "12.3 Decentralized Autonomous Organizations" },
      { type: "paragraph",
        zh: "想象一个合约，持有大量 ETH，规则是「持有治理代币的人可以发起提案，超过 50% 票则执行该提案」。这就是 DAO —— 一个由代码而非董事会运行的组织。",
        en: "Imagine a contract holding lots of ETH, with rules like 'governance-token holders can propose actions; 50%+ votes execute them'. That's a DAO — an organization run by code, not a board." },
      { type: "heading", level: 2, zh: "12.4 还有更多…", en: "12.4 And more…" },
      { type: "list",
        zh: ["保险（条件赔付）", "去中心化交易所 (DEX)", "身份与声誉系统", "链上游戏与 NFT", "预测市场"],
        en: ["Insurance (conditional payout)", "DEXes", "Identity & reputation", "On-chain games & NFTs", "Prediction markets"] },
      { type: "keypoint",
        zh: "白皮书 2013 年描绘的几乎每一类应用，到 2020 年代都真实出现并形成了千亿美元规模的市场。",
        en: "Almost every application the 2013 paper sketched has materialised by the 2020s, growing into a $100B+ ecosystem." }
    ],
    quiz: [
      { q: { zh: "在以太坊上发行一个代币，最核心需要保存什么？", en: "To issue a token, the most essential thing to store is…" },
        options: {
          zh: ["每个地址的余额映射", "矿工列表", "全部交易历史", "ERC-20 的 logo"],
          en: ["A balance mapping per address", "List of miners", "Full TX history", "ERC-20 logo"]
        },
        answer: 0,
        explain: {
          zh: "一个 mapping(address ⇒ uint256) 就够了 —— 这是 ERC-20 的核心存储。",
          en: "A single mapping(address ⇒ uint256) is enough — the heart of ERC-20."
        } },
      { q: { zh: "DAO 的「自治」体现在？", en: "What does 'autonomous' mean in DAO?" },
        options: {
          zh: ["完全没有人参与", "决策与执行都由链上合约规则完成", "由 AI 决策", "由矿工统治"],
          en: ["No humans at all", "Rules & execution live in on-chain code", "Run by AI", "Ruled by miners"]
        },
        answer: 1,
        explain: {
          zh: "人依然参与（投票），但规则与执行都靠合约，不依赖任何中心机构。",
          en: "Humans still vote, but rules and execution run via the contract — no central org."
        } }
    ]
  },

  {
    id: "ch13",
    title: { zh: "最新升级与路线图", en: "Latest Upgrades & Roadmap" },
    subtitle: { zh: "白皮书之后的十余年：从 PoW 到 PoS，走向 Rollup 中心化的未来", en: "A decade past the whitepaper: PoW → PoS, and a rollup-centric future" },
    sections: [
      { type: "paragraph",
        zh: "2013 年的白皮书描述的是「创世版」以太坊：PoW 挖矿、简单的 gasPrice 拍卖、单链扩容。此后十余年间，协议经历了多次大升级，也形成了一份公开、持续演进的长期路线图。这一章补上白皮书之后发生的事。",
        en: "The 2013 whitepaper describes 'genesis' Ethereum: PoW mining, a simple gasPrice auction, a single scaling chain. In the decade since, the protocol went through several major upgrades and grew a public, ever-evolving long-term roadmap. This chapter fills in what happened after the paper." },
      { type: "heading", level: 2, zh: "13.1 The Merge：切换到权益证明", en: "13.1 The Merge: switching to Proof of Stake" },
      { type: "paragraph",
        zh: "2020 年 12 月，一条独立的「信标链」(Beacon Chain) 上线，开始用权益证明 (PoS) 运行共识，但当时执行交易仍在原来的 PoW 链上。2022 年 9 月 15 日，「The Merge」把执行层焊接到信标链的共识层上，PoW 挖矿被彻底关闭 —— 以太坊自此完全由质押 32 ETH 的验证者出块，而不是矿工。",
        en: "In December 2020, a separate Beacon Chain launched, running Proof-of-Stake consensus while transaction execution still happened on the old PoW chain. On September 15, 2022, 'The Merge' welded the execution layer onto the Beacon Chain's consensus layer, permanently switching off PoW mining — blocks are now produced by validators staking 32 ETH each, not miners." },
      { type: "keypoint",
        zh: "The Merge 没有改变任何用户可见的功能（账户、合约、Gas 都照旧），但让全网耗电量下降了约 99.95%，并把发行率从「挖矿奖励」变为「验证者质押奖励」。",
        en: "The Merge changed no user-facing feature (accounts, contracts, gas all stayed the same), but cut network-wide energy use by roughly 99.95% and turned issuance from 'mining rewards' into 'validator staking rewards'." },
      { type: "heading", level: 2, zh: "13.2 主网升级时间线", en: "13.2 Mainnet upgrade timeline" },
      { type: "code", lang: "text",
        content:
`2020-12  信标链上线 (Beacon Chain)         引入 PoS 共识（暂不影响执行层）
2021-08  London 升级 / EIP-1559           费用改为 baseFee(销毁) + tip(小费)
2022-09  The Merge                        PoW → PoS，执行层与共识层合并
2023-04  Shanghai/Capella (上海升级)       验证者质押的 ETH 可以提现
2024-03  Dencun (坎昆-登科)/ EIP-4844      引入 blob，Rollup 数据费大降 90%+
2025-05  Pectra (布拉格-伊莱克特拉)         EIP-7702 账户抽象、验证者余额上限提高
2025~    Fusaka (富士-大阪)                PeerDAS，为完整 Danksharding 铺路` },
      { type: "tip",
        zh: "以太坊没有「路线图截止日」的说法——每次硬分叉都把一批 EIP 打包上线，命名习惯是「执行层城市名-共识层城市名」的组合（如 Dencun = Cancun + Deneb）。",
        en: "Ethereum has no fixed 'roadmap deadline' — each hard fork bundles a batch of EIPs and is named by combining an execution-layer city with a consensus-layer city (e.g. Dencun = Cancun + Deneb)." },
      { type: "heading", level: 2, zh: "13.3 Vitalik 的「终局」路线图：五个阶段", en: "13.3 Vitalik's 'Endgame' roadmap: five stages" },
      { type: "paragraph",
        zh: "2023 年起，Vitalik Buterin 把剩余工作归纳成五个押头韵的阶段，社区常简称为 The Surge / Scourge / Verge / Purge / Splurge。它们并非严格的先后顺序，而是可以并行推进的方向。",
        en: "Since 2023, Vitalik Buterin has grouped the remaining work into five alliterative stages, often shortened to The Surge / Scourge / Verge / Purge / Splurge. They aren't a strict sequence — the tracks progress in parallel." },
      { type: "list",
        zh: [
          "The Surge（扩容）：以 Rollup 为中心的扩容路线 —— L1 只负责当「数据可用性 + 结算层」，真正的交易执行搬到 L2；配合 Danksharding / PeerDAS 让 blob 空间指数级增长。",
          "The Scourge（去风险）：治理 MEV（矿工/验证者可提取价值）、抑制中心化质押池和再质押 (Restaking) 带来的系统性风险，保证协议「可信中立」。",
          "The Verge（瘦身验证）：用 Verkle 树替换部分 Merkle Patricia Trie，让区块证明变得极小，使普通手机也能无需信任地验证整条链（无状态客户端）。",
          "The Purge（做减法）：清理历史数据和过时功能（如状态过期、历史记录外部化），降低运行一个全节点的长期硬件门槛。",
          "The Splurge（收尾）：账户抽象、单槽终局性 (Single Slot Finality) 等一堆「不属于前四类但很重要」的改进。"
        ],
        en: [
          "The Surge (scaling): a rollup-centric roadmap — L1 becomes a data-availability + settlement layer while execution moves to L2s; Danksharding/PeerDAS grow blob space exponentially.",
          "The Scourge (de-risking): tame MEV (miner/validator extractable value) and the systemic risks from centralized staking pools and restaking, to keep the protocol credibly neutral.",
          "The Verge (slim verification): replace much of the Merkle Patricia Trie with Verkle Trees so block proofs become tiny, letting ordinary phones verify the chain trustlessly (stateless clients).",
          "The Purge (subtraction): prune historical data and legacy features (state expiry, moving history off-chain) to keep running a full node cheap long-term.",
          "The Splurge (everything else): account abstraction, Single Slot Finality, and other important odds and ends outside the first four buckets."
        ] },
      { type: "heading", level: 2, zh: "13.4 几个值得记住的新概念", en: "13.4 New concepts worth remembering" },
      { type: "list",
        zh: [
          "Proto-Danksharding / Blob（EIP-4844）：给 Rollup 专用的临时大数据「集装箱」，约 18 天后自动过期，不占永久状态，把 L2 手续费打下来一个数量级。",
          "PeerDAS：让每个节点只需下载、抽样验证一小部分 blob 数据即可确信其可用性，是通往完整 Danksharding 的中间步骤。",
          "账户抽象 (Account Abstraction, EIP-4337 / EIP-7702)：让普通账户也能拥有「合约钱包」的能力，比如社交恢复、批量交易、由他人代付 Gas。",
          "单槽终局性 (Single Slot Finality)：目标是让新区块一出现就立刻不可逆，而不是像今天这样等待多个 epoch 才「敲定」。",
          "再质押 (Restaking，如 EigenLayer)：把已经质押的 ETH「复用」去同时保护其他协议，收益更高但也把风险耦合在了一起——这正是 The Scourge 要重点关注的问题。"
        ],
        en: [
          "Proto-Danksharding / Blobs (EIP-4844): temporary bulk-data 'containers' reserved for rollups; they auto-expire after ~18 days, never bloat permanent state, and cut L2 fees by an order of magnitude.",
          "PeerDAS: lets each node confirm blob data is available by downloading and sampling only a small slice of it — a stepping stone to full Danksharding.",
          "Account Abstraction (EIP-4337 / EIP-7702): gives ordinary accounts 'smart wallet' powers — social recovery, batched transactions, someone else sponsoring your gas.",
          "Single Slot Finality: the goal of making a new block irreversible the instant it appears, instead of waiting several epochs to 'finalize' as today.",
          "Restaking (e.g. EigenLayer): reuses already-staked ETH to secure other protocols too, for extra yield — but couples their risks together, which is exactly what The Scourge worries about."
        ] },
      { type: "blockquote",
        zh: "「以太坊路线图不是一份写死的文档，而是社区研究进展的实时快照——这一章的具体日期和 EIP 编号会随时间推移而更新。」",
        en: "\"The Ethereum roadmap isn't a document frozen in time — it's a live snapshot of community research. The exact dates and EIP numbers in this chapter will keep changing.\"" }
    ],
    quiz: [
      { q: { zh: "The Merge（2022 年 9 月）具体做了什么？", en: "What did The Merge (Sept 2022) actually do?" },
        options: {
          zh: ["把执行层从 PoW 切换到 PoS 共识", "引入了智能合约", "把手续费改成 Gas 计价", "推出了 Layer 2"],
          en: ["Switched execution from PoW to PoS consensus", "Introduced smart contracts", "Made fees priced in gas", "Launched Layer 2"]
        },
        answer: 0,
        explain: {
          zh: "The Merge 只改变共识机制（PoW→PoS），账户、合约、Gas 计价方式在白皮书发布时就已存在。",
          en: "The Merge only changed the consensus mechanism (PoW→PoS); accounts, contracts and gas pricing already existed since the whitepaper."
        } },
      { q: { zh: "EIP-4844 引入的「blob」主要是为了解决什么？", en: "What problem does the 'blob' from EIP-4844 mainly solve?" },
        options: {
          zh: ["降低 Rollup 把数据发布到 L1 的成本", "提高矿工出块奖励", "取代 ECDSA 签名", "增加账户的 nonce 位数"],
          en: ["Lowering the cost for rollups to post data to L1", "Increasing miner block rewards", "Replacing ECDSA signatures", "Extending the nonce field width"]
        },
        answer: 0,
        explain: {
          zh: "blob 是专为 Rollup 数据可用性设计的临时存储空间，自动过期、不进永久状态，让 L2 手续费大幅下降。",
          en: "Blobs are temporary storage built for rollup data availability; they expire automatically, never enter permanent state, and sharply cut L2 fees."
        } },
      { q: { zh: "在「终局」路线图里，The Verge 的核心目标是？", en: "In the 'Endgame' roadmap, what is The Verge mainly about?" },
        options: {
          zh: ["用 Verkle 树实现极小证明，让无状态客户端也能验证链", "把所有交易搬到中心化服务器", "取消 Gas 机制", "禁止再质押"],
          en: ["Using Verkle trees for tiny proofs so stateless clients can verify the chain", "Moving all transactions to a centralized server", "Removing the gas mechanism", "Banning restaking"]
        },
        answer: 0,
        explain: {
          zh: "The Verge 关注验证的「瘦身」：Verkle 树让证明足够小，普通设备也能无需信任地验证全链状态。",
          en: "The Verge is about slimming down verification: Verkle trees make proofs small enough for ordinary devices to trustlessly verify the full chain state."
        } }
    ]
  }
];
