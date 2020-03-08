import React, { Component } from 'react';
import ChessBoard from './components/ChessBoard';
import './app.scss';

/**
 * 中国象棋
 */
export default class ChineseChess extends Component {
    state = {  }
    render() {
        return (
            <div className="chinese-chess">
                <ChessBoard />
            </div>
        );
    }
}


