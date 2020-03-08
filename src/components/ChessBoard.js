import React, { Component } from 'react';
import theme from './theme';

const VERTICAL = 10;
const HORIZONTAL = 9;
const PADDING = 2;

const cellCount = (n) => n - 1 + PADDING

/**
 * 象棋棋盘九纵十横
 * 棋盘内边距应该留两格距离
 */
export default class ChessBoard extends Component {
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

    componentDidMount() {
        // 计算格子宽度后，绘制棋盘
        this.computeCellWidth()
            .draw();

        window.addEventListener('resize', this.handleResize)
    }

    // 计算格子合适的宽度
    computeCellWidth() {
        // 屏幕宽度
        const width = document.documentElement.clientWidth - 40;
        // 屏幕高度
        const height = document.documentElement.clientHeight - 80;
        // 计算每个格子的宽度
        this.cellWidth = Math.min(width / cellCount(HORIZONTAL) , height / cellCount(VERTICAL));

        return this;
    }

    // 绘制棋盘
    draw() {
        const chessBoard = document.querySelector('.chess-board');
        const cellWidth = this.cellWidth;
        let canvas;
        
        if (this.canvas) {
            canvas = this.canvas;
        } else {
            canvas = document.createElement('canvas');
            chessBoard.appendChild(canvas);
        }
        
        canvas.width = cellWidth * cellCount(HORIZONTAL);
        canvas.height = cellWidth * cellCount(VERTICAL);

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.theme = theme();

        this.drawCell()
            .drawBorder()
            .drawText();

        return this;
    }

    /**
     * 画背景和格格
     * @param {Canvas} canvas 画布
     * @param {Number} cellWidth 格子宽度
     */
    drawCell() {
        const { canvas, ctx, theme, cellWidth } = this;

        const startX = (PADDING / 2) * cellWidth;
        const endX = HORIZONTAL * cellWidth;
        
        const startY1 = (PADDING / 2) * cellWidth;
        const endY1 = (VERTICAL / 2) * cellWidth;
        const startY2 = ((PADDING / 2) + (VERTICAL / 2)) * cellWidth;
        const endY2 = VERTICAL * cellWidth;

        const { lineWidth, lineColor, background } = theme;
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = lineColor;
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();

        for (let i = PADDING / 2; i < PADDING / 2 + HORIZONTAL; i++ ) {
            const positionX = i * cellWidth;

            if (i !== PADDING / 2 && i !== PADDING / 2 + HORIZONTAL - 1) {
                ctx.moveTo(positionX, startY1);
                ctx.lineTo(positionX, endY1);
                ctx.moveTo(positionX, startY2);
                ctx.lineTo(positionX, endY2);
                continue;
            }

            ctx.moveTo(positionX, startY1);
            ctx.lineTo(positionX, endY2);
        }

        for (let i = PADDING / 2; i < PADDING / 2 + VERTICAL; i++ ) {
            const positionY = i * cellWidth;
            ctx.moveTo(startX, positionY);
            ctx.lineTo(endX, positionY);
        }


        this.moveTo(PADDING / 2 + 3, PADDING / 2)
            .lineTo(PADDING / 2 + 5, PADDING / 2 + 2)
            .moveTo(PADDING / 2 + 5, PADDING / 2)
            .lineTo(PADDING / 2 + 3, PADDING / 2 + 2);

        this.moveTo(PADDING / 2 + 3, VERTICAL)
            .lineTo(PADDING / 2 + 5, VERTICAL - 2)
            .moveTo(PADDING / 2 + 5, VERTICAL)
            .lineTo(PADDING / 2 + 3, VERTICAL - 2);

        ctx.stroke();

        return this;
    }

    // 绘制边框
    drawBorder() {
        const { ctx, cellWidth, theme } = this;

        const { borderWidth, borderColor, borderDistance } = theme;
        ctx.lineWidth = borderWidth;
        ctx.strokeStyle = borderColor;

        const startX = (PADDING / 2) * cellWidth - borderDistance;
        const endX = HORIZONTAL * cellWidth + borderDistance;  
        const startY = (PADDING / 2) * cellWidth - borderDistance;
        const endY = VERTICAL * cellWidth + borderDistance;

        ctx.beginPath();
        this.moveTo(startX, startY, 1)
            .lineToMove(endX, startY, 1)
            .lineToMove(endX, endY, 1)
            .lineToMove(startX, endY, 1)
            .lineToMove(startX, startY, 1)
        ctx.stroke();

        return this;
    }

    // 绘制文字
    drawText() {
        const { ctx, cellWidth, theme } = this;
        const { textColor } = theme;

        const chuheText = '楚河';
        const hanjieText = '漢界';
        const fontSize = cellWidth * 0.8;

        ctx.font = `${fontSize}px STKaiti`;
        ctx.fillStyle = textColor;
        ctx.fillText(chuheText, (PADDING / 2 + 1.2) * cellWidth , (PADDING / 2 + 4.8) * cellWidth);
        ctx.fillText(hanjieText, (PADDING / 2 + 5.2) * cellWidth , (PADDING / 2 + 4.8) * cellWidth);
    }

    moveTo(x, y, cellWidth = this.cellWidth) {
        const { ctx } = this;
        ctx.moveTo(x * cellWidth, y * cellWidth);
        return this;
    }

    lineTo(x, y, cellWidth = this.cellWidth) {
        const { ctx } = this;
        ctx.lineTo(x * cellWidth, y * cellWidth);
        return this;
    }

    lineToMove(x, y, cellWidth = this.cellWidth) {
        const { ctx } = this;
        ctx.lineTo(x * cellWidth, y * cellWidth);
        ctx.moveTo(x * cellWidth, y * cellWidth);
        return this;
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

    render() {
        return (
            <div className="chess-board"></div>
        );
    }
}