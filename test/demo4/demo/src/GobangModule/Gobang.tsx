import React, { useState, useEffect } from 'react';
import styles from './Gobang.less';
import button from '@/GobangModule/button.less'

const BOARD_SIZE = 15;
type ChessType = 'black' | 'white' | null;

// 新增：评分权重（优先级从高到低）
const SCORE_WEIGHT = {
  WIN: 100000,    // 5子连珠（必胜）
  FOUR: 10000,    // 活四/冲四
  THREE: 1000,    // 活三
  TWO: 100,       // 活二
  BLOCK: 10,      // 堵玩家的连珠
  DEFAULT: 1      // 普通落子
};

const Gobang: React.FC = () => {
  const [board, setBoard] = useState<ChessType[][]>(
    Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<'black' | 'white'>('black');
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<ChessType>(null);
  // 新增：游戏模式（人机/双人）
  const [gameMode, setGameMode] = useState<'human' | 'ai'>('ai');

  // 重置游戏
  const resetGame = () => {
    setBoard(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null)));
    setCurrentPlayer('black');
    setGameOver(false);
    setWinner(null);
  };

  // 原有：胜负判断逻辑（不变）
  const checkWin = (
    board: ChessType[][],
    row: number,
    col: number,
    player: ChessType
  ): boolean => {
    const directions = [
      [[0, 1], [0, -1]],    // 水平
      [[1, 0], [-1, 0]],    // 垂直
      [[1, 1], [-1, -1]],   // 左斜
      [[1, -1], [-1, 1]]    // 右斜
    ];

    for (const [dir1, dir2] of directions) {
      let count = 1;
      let r = row + dir1[0];
      let c = col + dir1[1];
      while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
        count++;
        r += dir1[0];
        c += dir1[1];
      }

      r = row + dir2[0];
      c = col + dir2[1];
      while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
        count++;
        r += dir2[0];
        c += dir2[1];
      }

      if (count >= 5) return true;
    }
    return false;
  };

  // 新增：计算单个位置的得分（核心AI逻辑）
  const calculateScore = (board: ChessType[][], row: number, col: number, player: ChessType): number => {
    if (board[row][col] !== null) return 0; // 已有棋子，得分为0

    let score = 0;
    const opponent = player === 'black' ? 'white' : 'black';
    const directions = [
      [[0, 1], [0, -1]],    // 水平
      [[1, 0], [-1, 0]],    // 垂直
      [[1, 1], [-1, -1]],   // 左斜
      [[1, -1], [-1, 1]]    // 右斜
    ];

    // 遍历每个方向，统计连珠数
    for (const [dir1, dir2] of directions) {
      let selfCount = 0;  // 己方连珠数
      let oppCount = 0;   // 对方连珠数
      let emptyCount = 0; // 空位数

      // 统计己方连珠
      let r = row + dir1[0];
      let c = col + dir1[1];
      while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
        selfCount++;
        r += dir1[0];
        c += dir1[1];
      }
      r = row + dir2[0];
      c = col + dir2[1];
      while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
        selfCount++;
        r += dir2[0];
        c += dir2[1];
      }

      // 统计对方连珠
      r = row + dir1[0];
      c = col + dir1[1];
      while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === opponent) {
        oppCount++;
        r += dir1[0];
        c += dir1[1];
      }
      r = row + dir2[0];
      c = col + dir2[1];
      while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === opponent) {
        oppCount++;
        r += dir2[0];
        c += dir2[1];
      }

      // 根据连珠数赋值得分
      if (selfCount >= 4) score += SCORE_WEIGHT.WIN;        // 活四/冲四（必胜）
      else if (selfCount === 3) score += SCORE_WEIGHT.THREE; // 活三
      else if (selfCount === 2) score += SCORE_WEIGHT.TWO;   // 活二
      
      if (oppCount >= 4) score += SCORE_WEIGHT.WIN;          // 堵对方的四
      else if (oppCount === 3) score += SCORE_WEIGHT.THREE;  // 堵对方的三
      else if (oppCount === 2) score += SCORE_WEIGHT.BLOCK;  // 堵对方的二
    }

    return score;
  };

  // 新增：AI落子逻辑（选择得分最高的位置）
  const aiMove = () => {
    if (gameOver) return;

    let maxScore = 0;
    let bestRow = 0;
    let bestCol = 0;

    // 遍历所有空位置，计算得分
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (board[row][col] !== null) continue;

        const score = calculateScore(board, row, col, currentPlayer);
        if (score > maxScore) {
          maxScore = score;
          bestRow = row;
          bestCol = col;
        }
      }
    }

    // AI落子
    const newBoard = [...board];
    newBoard[bestRow][bestCol] = currentPlayer;
    setBoard(newBoard);

    // 检查AI是否获胜
    if (checkWin(newBoard, bestRow, bestCol, currentPlayer)) {
      setGameOver(true);
      setWinner(currentPlayer);
      alert(`${currentPlayer === 'black' ? '黑棋' : '白棋'}（AI）获胜！`);
      return;
    }

    // 切换回玩家
    setCurrentPlayer(currentPlayer === 'black' ? 'white' : 'black');
  };

  // 原有：玩家落子逻辑（新增AI回合触发）
  const handleClickCell = (row: number, col: number) => {
    if (gameOver || board[row][col] !== null || (gameMode === 'ai' && currentPlayer === 'white')) return;

    const newBoard = [...board];
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);

    if (checkWin(newBoard, row, col, currentPlayer)) {
      setGameOver(true);
      setWinner(currentPlayer);
      alert(`${currentPlayer === 'black' ? '黑棋' : '白棋'}（玩家）获胜！`);
      return;
    }

    // 切换到AI回合（人机模式下）
    setCurrentPlayer(currentPlayer === 'black' ? 'white' : 'black');
  };

  // 新增：AI回合自动落子（延迟500ms，模拟思考）
  useEffect(() => {
    if (gameMode === 'ai' && currentPlayer === 'white' && !gameOver) {
      const timer = setTimeout(() => {
        aiMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameMode, gameOver, board]);

  return (
    <div className={styles.gobangContainer}>
      <h2 className={styles.title}>五子棋（{gameMode === 'ai' ? '人机对战' : '双人对战'}）</h2>
      
      {/* 新增：模式切换按钮 */}
      <div className={styles.modeSwitch}>
        <button 
          onClick={() => setGameMode('ai')}
          className={`${button.button} ${gameMode === 'ai' ? styles.active : ''}`}
        >
          人机对战
        </button>
        <button 
          onClick={() => setGameMode('human')}
          className={`${button.button} ${gameMode === 'human' ? styles.active : ''}`}
        >
          双人对战
        </button>
      </div>

      <div className={styles.board} style={{ 
        gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
        gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`
      }}>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={styles.cell}
              onClick={() => handleClickCell(rowIndex, colIndex)}
            >
              {cell && <div className={`${styles.chess} ${styles[cell]}`}></div>}
            </div>
          ))
        )}
      </div>

      <div className={styles.status}>
        {gameOver ? (
          <span>{winner === 'black' ? '黑棋' : '白棋'}获胜！</span>
        ) : (
          <span>当前回合：{currentPlayer === 'black' ? '黑棋（玩家）' : '白棋（AI）'}</span>
        )}
        <button onClick={resetGame} className={button.button}>重置游戏</button>
      </div>
    </div>
  );
};

export default Gobang;