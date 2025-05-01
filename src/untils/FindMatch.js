import { Matches } from "../fake_data/Binh/fake_data";


export default function FindMatch() {
    const randomColor = Math.round(Math.random());
    console.log(randomColor); // Neu ra 0 thi nguoi choi hien tai phe den, 1 phe trang
    const matchResult= randomColor!=0?[Matches.playerWhite,Matches.playerBlack]:[Matches.playerBlack,Matches.playerWhite];
    return {
        matchResult:matchResult,
        isCurrentPlayerWhite:randomColor!=0
    }
}