export class Setting {
    inputStyles?: { [key: string]: any };
    wrapperStyles?: { [key: string]: any };
    allowKeyCodes?: string[];
    length: number = 4;
    numbersOnly?: boolean;
    inputClass?: string;
    wrapperClass?: string;
    timer?: number;
    btnClass?: string;
    timerType?: number; //  0: secs, 1: mins
}