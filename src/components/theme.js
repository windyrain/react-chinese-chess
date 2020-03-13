export default () => {

    return {
        // 棋盘
        lineWidth: 1,
        lineColor: '#221c15',
        background: '#ddba84',
        borderWidth: 1.5,
        borderColor: '#221c15',
        borderDistance: 4,
        textColor: '#000',

        // 棋子
        chessman: {
            shadowOffsetX: 2,
            shadowOffsetY: 2,
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            chessmanOutsideColor: '#dca373',
            chessmanInsideColor: '#e4d0a1',
            redColor: '#bc291d',
            blackColor: '#100d0d'
        } 
    }

}