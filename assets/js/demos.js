// Interactive demos shared across chapters.
// Use the browser-native crypto.subtle.digest for SHA-256.

window.DEMOS = (function() {
  async function sha256Hex(str) {
    const buf = new TextEncoder().encode(str);
    const hash = await crypto.subtle.digest('SHA-256', buf);
    return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // ---------- PoW demo ----------
  function powDemo() {
    const lang = window.STATE.lang;
    const labels = lang === 'zh'
      ? { msg: '区块内容', diff: '难度（前缀 0 的个数）', mine: '开始挖矿', stop: '停止', tries: '尝试次数', found: '✓ 找到了！', hash: '当前哈希', nonce: 'nonce' }
      : { msg: 'Block data', diff: 'Difficulty (leading zeros)', mine: 'Start mining', stop: 'Stop', tries: 'Tries', found: '✓ Found!', hash: 'Current hash', nonce: 'nonce' };

    const el = document.createElement('div');
    el.className = 'demo';
    el.innerHTML = `
      <div class="demo-title">⛏  ${lang === 'zh' ? '迷你 PoW 挖矿' : 'Mini PoW miner'}</div>
      <div class="demo-controls">
        <label>${labels.msg}:</label>
        <input type="text" id="pow-msg" value="Hello Ethereum" />
        <label>${labels.diff}:</label>
        <input type="number" id="pow-diff" min="1" max="6" value="4" style="min-width:60px;flex:0;" />
        <button id="pow-start">${labels.mine}</button>
        <button id="pow-stop">${labels.stop}</button>
      </div>
      <div class="demo-output" id="pow-out">—</div>
    `;
    let running = false;
    el.querySelector('#pow-stop').onclick = () => running = false;
    el.querySelector('#pow-start').onclick = async () => {
      if (running) return;
      running = true;
      const msg = el.querySelector('#pow-msg').value;
      const diff = Math.max(1, Math.min(6, parseInt(el.querySelector('#pow-diff').value) || 4));
      const target = '0'.repeat(diff);
      const out = el.querySelector('#pow-out');
      let nonce = 0;
      const t0 = performance.now();
      while (running) {
        const h = await sha256Hex(msg + ':' + nonce);
        if (h.startsWith(target)) {
          const ms = (performance.now() - t0).toFixed(0);
          out.textContent = `${labels.found}\n${labels.nonce} = ${nonce}\n${labels.hash} = ${h}\n${labels.tries} = ${nonce + 1}  (${ms} ms)`;
          running = false;
          return;
        }
        if (nonce % 200 === 0) {
          out.textContent = `${labels.tries} = ${nonce}\n${labels.hash} = ${h}`;
          await new Promise(r => setTimeout(r, 0));
        }
        nonce++;
      }
    };
    return el;
  }

  // ---------- Merkle demo ----------
  function merkleDemo() {
    const lang = window.STATE.lang;
    const labels = lang === 'zh'
      ? { input: '每行一条数据 (4 行最佳)', build: '构建 Merkle 树', root: 'Merkle Root' }
      : { input: 'One leaf per line (4 lines works best)', build: 'Build Merkle Tree', root: 'Merkle Root' };

    const el = document.createElement('div');
    el.className = 'demo';
    el.innerHTML = `
      <div class="demo-title">🌲 ${lang === 'zh' ? 'Merkle 树构造' : 'Build a Merkle tree'}</div>
      <div class="demo-controls" style="flex-direction:column;align-items:stretch;">
        <label>${labels.input}:</label>
        <textarea id="merkle-in" rows="4" style="min-width:100%;">Alice→Bob 10
Charlie→Dave 5
Eve→Mallory 2
Trent→Sybil 1</textarea>
        <button id="merkle-go" style="align-self:flex-start;">${labels.build}</button>
      </div>
      <div id="merkle-tree"></div>
      <div class="demo-output" id="merkle-root"></div>
    `;

    el.querySelector('#merkle-go').onclick = async () => {
      const lines = el.querySelector('#merkle-in').value
        .split('\n').map(s => s.trim()).filter(Boolean);
      if (!lines.length) return;
      let level = await Promise.all(lines.map(async l => ({ data: l, hash: await sha256Hex(l) })));
      const levels = [level];
      while (level.length > 1) {
        const next = [];
        for (let i = 0; i < level.length; i += 2) {
          const a = level[i], b = level[i + 1] || level[i]; // duplicate if odd
          const combined = a.hash + b.hash;
          next.push({ hash: await sha256Hex(combined), children: [a, b] });
        }
        levels.push(next);
        level = next;
      }
      const tree = el.querySelector('#merkle-tree');
      tree.className = 'tree-vis';
      tree.innerHTML = '';
      for (let i = levels.length - 1; i >= 0; i--) {
        const row = document.createElement('div');
        row.className = 'tree-row';
        for (const node of levels[i]) {
          const n = document.createElement('div');
          n.className = 'tree-node' + (i === levels.length - 1 ? ' root' : '') + (i === 0 ? ' leaf' : '');
          const label = i === 0 ? `${node.data}\n${node.hash.slice(0, 10)}…` : `${node.hash.slice(0, 12)}…`;
          n.textContent = label;
          n.title = node.hash;
          row.appendChild(n);
        }
        tree.appendChild(row);
      }
      el.querySelector('#merkle-root').textContent = `${labels.root}\n${level[0].hash}`;
    };
    return el;
  }

  // ---------- EVM (toy) demo ----------
  function evmDemo() {
    const lang = window.STATE.lang;
    const labels = lang === 'zh'
      ? { code: '迷你字节码（支持 PUSH n / ADD / SUB / MUL / DUP / SWAP / SSTORE k v / PRINT）', run: '运行', stack: '栈', storage: '存储', out: '输出' }
      : { code: 'Toy bytecode (PUSH n / ADD / SUB / MUL / DUP / SWAP / SSTORE k v / PRINT)', run: 'Run', stack: 'Stack', storage: 'Storage', out: 'Output' };

    const sample = `PUSH 5
PUSH 3
ADD
PRINT
PUSH 0
SSTORE 0 8`;
    const el = document.createElement('div');
    el.className = 'demo';
    el.innerHTML = `
      <div class="demo-title">🖥  ${lang === 'zh' ? '迷你 EVM 模拟器' : 'Toy EVM simulator'}</div>
      <div class="demo-controls" style="flex-direction:column;align-items:stretch;">
        <label>${labels.code}:</label>
        <textarea id="evm-code" rows="7" style="min-width:100%;">${sample}</textarea>
        <button id="evm-run" style="align-self:flex-start;">${labels.run}</button>
      </div>
      <div class="demo-output" id="evm-out">—</div>
    `;
    el.querySelector('#evm-run').onclick = () => {
      const code = el.querySelector('#evm-code').value
        .split('\n').map(s => s.trim()).filter(Boolean);
      const stack = [];
      const storage = {};
      const log = [];
      let gas = 0;
      try {
        for (const raw of code) {
          const parts = raw.split(/\s+/);
          const op = parts[0].toUpperCase();
          if (op === 'PUSH') { stack.push(Number(parts[1])); gas += 3; }
          else if (op === 'ADD') { stack.push(stack.pop() + stack.pop()); gas += 3; }
          else if (op === 'SUB') { const b = stack.pop(), a = stack.pop(); stack.push(a - b); gas += 3; }
          else if (op === 'MUL') { stack.push(stack.pop() * stack.pop()); gas += 5; }
          else if (op === 'DUP') { stack.push(stack[stack.length - 1]); gas += 3; }
          else if (op === 'SWAP') { const a = stack.pop(), b = stack.pop(); stack.push(a); stack.push(b); gas += 3; }
          else if (op === 'SSTORE') { storage[parts[1]] = Number(parts[2]); gas += 20000; }
          else if (op === 'PRINT') { log.push(`> ${stack[stack.length - 1]}`); gas += 1; }
          else throw new Error('Unknown op: ' + op);
        }
        el.querySelector('#evm-out').textContent =
          `${labels.stack}: [${stack.join(', ')}]\n${labels.storage}: ${JSON.stringify(storage)}\n${labels.out}:\n${log.join('\n')}\ngas used ≈ ${gas}`;
      } catch (e) {
        el.querySelector('#evm-out').textContent = '✗ ' + e.message;
      }
    };
    return el;
  }

  // ---------- Gas calc ----------
  function gasDemo() {
    const lang = window.STATE.lang;
    const el = document.createElement('div');
    el.className = 'demo';
    el.innerHTML = `
      <div class="demo-title">⛽ ${lang === 'zh' ? 'Gas 费用计算器' : 'Gas fee calculator'}</div>
      <div class="demo-controls">
        <label>gasUsed:</label><input type="number" id="g-used" value="50000" />
        <label>gasPrice (gwei):</label><input type="number" id="g-price" value="20" />
        <label>ETH/USD:</label><input type="number" id="g-eth" value="3000" />
        <button id="g-go">${lang === 'zh' ? '计算' : 'Compute'}</button>
      </div>
      <div class="demo-output" id="g-out">—</div>
    `;
    el.querySelector('#g-go').onclick = () => {
      const used = Number(el.querySelector('#g-used').value) || 0;
      const price = Number(el.querySelector('#g-price').value) || 0;
      const ethUsd = Number(el.querySelector('#g-eth').value) || 0;
      const feeWei = used * price * 1e9;
      const feeEth = feeWei / 1e18;
      const feeUsd = feeEth * ethUsd;
      el.querySelector('#g-out').textContent =
        `fee = gasUsed × gasPrice = ${used} × ${price} gwei\n     = ${(used * price).toLocaleString()} gwei\n     = ${feeEth.toFixed(8)} ETH\n     ≈ $${feeUsd.toFixed(4)} USD`;
    };
    return el;
  }

  return { pow: powDemo, merkle: merkleDemo, evm: evmDemo, gas: gasDemo };
})();
