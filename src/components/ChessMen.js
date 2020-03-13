import React, { Component } from 'react';
import { cellCount, VERTICAL, HORIZONTAL, PADDING } from "./ChessBoard";
import theme from './theme';

const chessMen = [
    [241, 251, 231, 221, 211, 222, 232, 252, 242],
    [0,   0,   0,   0,   0,   0,   0,   0,   0],
    [0,   261, 0,   0,   0,   0,   0,   262, 0],
    [201, 0,   202, 0,   203, 0,   204, 0,   205],
    [0,   0,   0,   0,   0,   0,   0,   0,   0],
    [0,   0,   0,   0,   0,   0,   0,   0,   0],
    [101, 0,   102, 0,   103, 0,   104, 0,   105],
    [0,   161, 0,   0,   0,   0,   0,   162, 0],
    [0,   0,   0,   0,   0,   0,   0,   0,   0],
    [141, 151, 131, 121, 111, 122, 132, 152, 142]
];

const COLOR_TYPE = {
    RED: 1,
    BLACK: 2
};

const RED = {
    0: '兵',
    1: '帅',
    2: '仕',
    3: '相',
    4: '車',
    5: '馬',
    6: '炮'
}

const BLACK = {
    0: '卒',
    1: '将',
    2: '士',
    3: '象',
    4: '車',
    5: '馬',
    6: '炮'
}

let stepClear = 1;

export default class ChessMen extends Component {

    // 画布
    canvas;
    // 画布句柄
    ctx;
    // 主题
    theme;
    // 格子宽度
    cellWidth;
    // resize timeout
    timeout;
    // 闪烁
    isBlink = false;
    // 记录上一次位置
    lastI = 0;
    lastJ = 0;
    lastColor;
    // 记录轮到谁走了
    isRedTurn = true;

    componentDidMount() {
        // 计算格子宽度后，绘制棋盘
        setTimeout(() => {
            this.computeCellWidth()
            .draw();
        }, 500);

        window.addEventListener('resize', this.handleResize);
    }

    // 计算格子合适的宽度
    computeCellWidth() {
        // 屏幕宽度
        const width = document.documentElement.clientWidth;
        // 屏幕高度
        const height = document.documentElement.clientHeight - 80;
        // 计算每个格子的宽度
        this.cellWidth = Math.min(width / cellCount(HORIZONTAL) , height / cellCount(VERTICAL));

        return this;
    }

    // 画棋子
    draw() {
        const chessBoard = document.querySelector('.chess-men');
        const cellWidth = this.cellWidth;
        let canvas;
        
        if (this.canvas) {
            canvas = this.canvas;
        } else {
            canvas = document.createElement('canvas');
            chessBoard.appendChild(canvas);
            canvas.addEventListener('click', this.handleChessClick);
        }
        
        canvas.width = cellWidth * cellCount(HORIZONTAL);
        canvas.height = cellWidth * cellCount(VERTICAL);

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.theme = theme();
        this.ctx.fillStyle = '#ffffff00'; // 追加设置透明，华为P30不设置会是黑色
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);

        this.drawAll();

        return this;
    }

    drawAll() {
        for (let i = 0; i < VERTICAL; i++) {
            for (let j = 0; j < HORIZONTAL; j++) {
                const chessman = chessMen[i][j];

                if (chessman === 0) continue;
                this.drawChessman(i, j);
            }
        }
    }

    drawChessman(i, j) {
        const { ctx, theme, cellWidth } = this;

        const {
            shadowOffsetX,
            shadowOffsetY,
            shadowBlur,
            shadowColor,
            chessmanOutsideColor,
            chessmanInsideColor,
            redColor,
            blackColor
        } = theme.chessman;

        if (chessMen[i][j] === 0) return;

        const chessman = chessMen[i][j];
        const [colorType, chessType] = String(chessman).split('');
        const chessName = COLOR_TYPE.RED === Number(colorType) ? RED[chessType] : BLACK[chessType];

        const positionX = (PADDING / 2 + j) * cellWidth;
        const positionY = (PADDING / 2 + i) * cellWidth;
        const radius = cellWidth * 0.8 / 2;

        ctx.beginPath();
        ctx.shadowOffsetX = shadowOffsetX; // 设置水平位移
        ctx.shadowOffsetY = shadowOffsetY; // 设置垂直位移
        ctx.shadowBlur = shadowBlur; // 设置模糊度
        ctx.shadowColor = shadowColor; // 设置阴影颜色
        ctx.arc(positionX, positionY, radius, 0, Math.PI*2, true); 
        ctx.lineWidth = cellWidth * 0.1 / 2;
        ctx.strokeStyle = chessmanOutsideColor;
        ctx.fillStyle = chessmanInsideColor;
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.shadowBlur = 0; // 设置模糊度
        ctx.font = `${cellWidth * (Number(chessType) === 6 ? 0.65 : 0.68)}px STKaiti`;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        ctx.textAlign = 'center';
        ctx.fillStyle = COLOR_TYPE.RED === Number(colorType) ? redColor : blackColor;
        ctx.fillText(chessName, positionX, positionY + cellWidth * (Number(chessType) === 6 ? 0.21 : 0.25));
        ctx.stroke();
    }

    blink(i, j) {
        this.isBlink = true;
        const func = () => {
            this.clearChessman(i, j);
            this.blinkTimeout = setTimeout(() => {
                this.drawChessman(i, j);
            }, 500);
        }

        this.blinkInterval = setInterval(() => {
            func();
        }, 1000);
        func();
    }

    unblink() {
        this.isBlink = false;
        clearInterval(this.blinkInterval);
    }

    clearChessman(i, j) {
        const { cellWidth } = this;
        const x = (PADDING / 2 + j) * cellWidth;
        const y = (PADDING / 2 + i) * cellWidth;
        this.clearArc(x, y, cellWidth * 1.1 / 2);
    }

    clearArc(x, y, radius) {
        const { ctx } = this;
        //圆心(x,y)，半径radius
        var calcWidth = radius - stepClear;
        var calcHeight = Math.sqrt(radius * radius - calcWidth * calcWidth);
    
        var posX = x - calcWidth;
        var posY = y - calcHeight;
    
        var widthX = 2 * calcWidth;
        var heightY = 2 * calcHeight;
    
        if (stepClear <= radius) {
            ctx.clearRect(posX, posY, widthX, heightY);
            stepClear += 1;
            this.clearArc(x, y, radius);
        } else {
            stepClear = 1;
        }
    }

    handleResize = () => {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.computeCellWidth()
                .draw();
        }, 200);
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
        window.removeEventListener('resize', this.handleResize);
    }

    handleChessClick = (e) => {
        const { cellWidth } = this;
        const j = Math.round(e.layerX / cellWidth) - PADDING / 2;
        const i = Math.round(e.layerY / cellWidth) - PADDING / 2;

        // 超越边界
        if ( i < 0 || i > 9 || j < 0 || j > 8) return;

        const chessMan = chessMen[i][j];
        const chessColor = Number(String(chessMan).split('')[0]);

        // 无闪烁棋子，且点击为空位的时候，直接返回
        if (!this.isBlink && chessMan === 0) return; 
        if (!this.isBlink && chessColor === COLOR_TYPE.BLACK && this.isRedTurn) return;
        if (!this.isBlink && chessColor === COLOR_TYPE.RED && !this.isRedTurn) return;

        if (!this.isBlink) {
            this.blink(i, j);
            this.lastI = i;
            this.lastJ = j;
            this.lastColor = chessColor;
        } else {
            this.unblink();

            if (this.isShouldMove(i, j)) {
                var temp = chessMen[this.lastI][this.lastJ];
                chessMen[i][j] = temp;
                chessMen[this.lastI][this.lastJ] = 0;
                this.draw();
                this.isRedTurn = !this.isRedTurn;
                return;
            }

            if ((i !== this.lastI || j !== this.lastJ) && chessMen[i][j] !== 0) {
                if (chessColor === COLOR_TYPE.BLACK && this.isRedTurn) return;
                if (chessColor === COLOR_TYPE.RED && !this.isRedTurn) return;
                this.blink(i, j);
                this.lastI = i;
                this.lastJ = j;
                return;
            }
        }
    }

    isShouldMove = (i, j) => {
        const chessMan = chessMen[this.lastI][this.lastJ];
        const chessInfo = String(chessMan).split('');
        const chessColor = Number(chessInfo[0]);
        const chessType = Number(chessInfo[1]);
        const isRed = COLOR_TYPE.RED === chessColor;

        // 同颜色不应该移动
        if (this.lastColor ===  Number(String(chessMen[i][j]).split('')[0])) return;
        // 位置未变，不需要移动
        if (this.lastI === i && this.lastJ === j) return;

        let chessCount = 0, isEndByChess = false;

        switch (chessType) {
            case 0:
                if (isRed) {
                    if ((this.lastI - i === 1 && this.lastJ - j === 0) ||
                        (Math.abs(this.lastJ - j) === 1 && this.lastI - i === 0 && i <= 4)) {
                        return true;
                    }
                } else {
                    if ((this.lastI - i === -1 && this.lastJ - j === 0) || 
                        (Math.abs(this.lastJ - j) === 1 && this.lastI - i === 0 && i > 4)) {
                        return true;
                    }
                }
                break;
            case 1:
                if ((Math.abs(this.lastI - i) === 1 && this.lastJ === j) || 
                    (Math.abs(this.lastJ - j) === 1 && this.lastI === i)) {
                    if (isRed) {
                        if (['93', '94', '95', '83', '84', '85', '73', '74', '75'].includes(`${i}${j}`)) return true;
                    } else {
                        if (['03', '04', '05', '13', '14', '15', '23', '24', '25'].includes(`${i}${j}`)) return true;
                    }
                }
                break;
            case 2:
                if ((Math.abs(this.lastI - i) === 1 && Math.abs(this.lastJ - j) === 1) || 
                    (Math.abs(this.lastJ - j) === 1 && Math.abs(this.lastI - i) === 1)) {
                    if (isRed) {
                        if (['93', '95', '84', '73', '75'].includes(`${i}${j}`)) return true;
                    } else {
                        if (['03', '05', '14', '23', '25'].includes(`${i}${j}`)) return true;
                    }
                }
                break;
            case 3:
                if (((Math.abs(this.lastI - i) === 2 && Math.abs(this.lastJ - j) === 2) || 
                    (Math.abs(this.lastJ - j) === 2 && Math.abs(this.lastI - i) === 2)) && 
                    chessMen[(this.lastI + i) / 2][(this.lastJ + j) / 2] === 0) {
                    if (isRed) {
                        if (i > 4) return true;
                    } else {
                        if (i <= 4) return true;
                    }
                }
                break;
            case 4:
                // 如果纵向移动
                if (this.lastJ === j) {
                    let start, end;

                    if (i > this.lastI) {
                        start = this.lastI;
                        end = i;
                    } else {
                        start = i;
                        end = this.lastI;
                    }

                    for (let m = start; m <= end; m++) {
                        if (chessMen[m][j] !== 0) {
                            chessCount++;

                            if (m === i) {
                                isEndByChess = true;
                            }
                        }
                    }
                    return chessCount === 1 || (chessCount === 2 && isEndByChess);
                }

                // 如何横向移动
                if (this.lastI === i) {
                    let start, end;
                    
                    if (j < this.lastJ) {
                        start = j;
                        end = this.lastJ;
                    } else {
                        start = this.lastJ;
                        end = j;
                    }

                    for (let m = start; m <= end; m++) {
                        if (chessMen[i][m] !== 0) {
                            chessCount++;

                            if (m === j) {
                                isEndByChess = true;
                            }
                        }
                    }
                    return chessCount === 1 || (chessCount === 2 && isEndByChess);
                }
                break;
            case 5:
                if (((Math.abs(this.lastI - i) === 2 && Math.abs(this.lastJ - j) === 1) && chessMen[(this.lastI + i) / 2][this.lastJ] === 0 )|| 
                    ((Math.abs(this.lastJ - j) === 2 && Math.abs(this.lastI - i) === 1) && chessMen[this.lastI][(this.lastJ + j) / 2] === 0)) {
                        return true;
                }
                break;
            case 6:
                // 如果纵向移动
                if (this.lastJ === j) {
                    let start, end;

                    if (i > this.lastI) {
                        start = this.lastI;
                        end = i;
                    } else {
                        start = i;
                        end = this.lastI;
                    }

                    for (let m = start; m <= end; m++) {
                        if (chessMen[m][j] !== 0) {
                            chessCount++;

                            if (m === i) {
                                isEndByChess = true;
                            }
                        }
                    }
                    return chessCount === 1 || (chessCount === 3 && isEndByChess);
                }

                // 如何横向移动
                if (this.lastI === i) {
                    let start, end;
                    
                    if (j < this.lastJ) {
                        start = j;
                        end = this.lastJ;
                    } else {
                        start = this.lastJ;
                        end = j;
                    }

                    for (let m = start; m <= end; m++) {
                        if (chessMen[i][m] !== 0) {
                            chessCount++;

                            if (m === j) {
                                isEndByChess = true;
                            }
                        }
                    }
                    return chessCount === 1 || (chessCount === 3 && isEndByChess);
                }
                break;
        }
    }

    render() {
        return (
            <div className="chess-men"></div>
        );
    }
}