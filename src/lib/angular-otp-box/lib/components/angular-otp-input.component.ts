import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, OnChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { KeysPipe } from '../pipes/keys.pipe';
import { Setting } from '../models/setting';
import { CounterDirective } from '../directives/timer.directive';

@Component({
	selector: 'angular-otp',
	templateUrl: './angular-otp-input.component.html',
	styleUrls: ['./angular-otp-input.component.scss']
})

export class OtpInputComponent implements OnInit, OnChanges {
	@Input() setting: Setting = { 
		length: 4, 
		timer: 0,
		timerType: 0
	};
	@Input() hasError = false;
	@Output() onValueChange = new EventEmitter<any>();
	@ViewChildren(CounterDirective) CounterDirective : any;
	otpForm!: FormGroup;
	inputControls: FormControl[] = new Array(this.setting.length);
	componentKey = Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
	public counter: any;
	
	constructor(private keysPipe: KeysPipe) {
		
	}

	public ngOnInit(): void {
		this.otpForm = new FormGroup({})
		for (let index = 0; index < this.setting.length; index++) {
			this.otpForm.addControl(this.getControlName(index), new FormControl())
		}
	}
	
	ngOnChanges(): void {
		if(this.hasError){
			this.otpForm?.reset();
		}
	}

	public ngAfterViewInit(): void {
		let containerItem = document.getElementById(`c_${this.componentKey}`);
		if (containerItem) {
			let ele: any = containerItem.getElementsByClassName('.otp-input')[0]
			if (ele && ele.focus) {
				ele.focus();
			}
		}
	}

	private getControlName(idx : any) {
		return `ctrl_${idx}`;
	}

	isLeftArrow(e : any) {
		return this.isKeyCode(e, 37);
	}

	isRightArrow(e : any) {
		return this.isKeyCode(e, 39);
	}

	isBackspaceOrDelete(e : any) {
		return e.key === "Backspace" || e.key === "Delete" || this.isKeyCode(e, 8) || this.isKeyCode(e, 46);
	}

	isKeyCode(e : any, targetCode: any) {
		var key = e.keyCode || e.charCode;
		if(key == targetCode) { return true; }
		return false;
	}

	keyUp(e: any, inputIdx: number) {
		let nextInputId = this.appendKey(`otp_${inputIdx + 1}`);
		let prevInputId = this.appendKey(`otp_${inputIdx - 1}`);
		if (this.isRightArrow(e)) {
			this.setSelected(nextInputId);
			return;
		}
		if (this.isLeftArrow(e)) {
			this.setSelected(prevInputId);
			return;
		}
		let isBackspace = this.isBackspaceOrDelete(e);
		if (isBackspace && !e.target.value) {
			this.setSelected(prevInputId);
			this.rebuildValue();
			return;
		}
		if (!e.target.value) {
			return;
		}
		if (this.isValidEntry(e)) {
			this.focusTo(nextInputId);
		}
		this.rebuildValue();
	}

	appendKey(id: any) {
		return `${id}_${this.componentKey}`;
	}

	setSelected(eleId : string) {
		this.focusTo(eleId);
		let ele: any = document.getElementById(eleId);
		if (ele && ele.setSelectionRange) {
			setTimeout(() => {
				ele.setSelectionRange(0, 1);
			}, 0);
		}
	}

	isValidEntry(e : any) {
		var inp = String.fromCharCode(e.keyCode);
		var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
		return isMobile || /[a-zA-Z0-9-_]/.test(inp) || (this.setting.allowKeyCodes && this.setting.allowKeyCodes.includes(e.keyCode)) || (e.keyCode >= 96 && e.keyCode <= 105);
	}

	focusTo(eleId: string) {
		let ele: any = document.getElementById(eleId);
		if (ele) {
			ele.focus();
			ele.selectionStart = ele.selectionEnd = 100;
		}
	}

	rebuildValue() {
		let val = '';
		this.keysPipe.transform(this.otpForm.controls).forEach(k => {
			if (this.otpForm.controls[k].value) {
				val += this.otpForm.controls[k].value;
			}
		});
		this.onValueChange.emit(val);
	}

	public onCounterChange(e : any): void {
		this.counter = e;
		if(this.counter == 0) {
			this.onValueChange.emit(-1);
		}
	}

	ressendOtp(): void {
		this.CounterDirective.first.startTimer();
		this.onValueChange.emit(-2);
	}

	public formatSecsToMins(time: number) {   
		// Hours, minutes and seconds
		var hrs = ~~(time / 3600);
		var mins = ~~((time % 3600) / 60);
		var secs = ~~time % 60;
	
		// Output like "1:01" or "4:03:59" or "123:03:59"
		var ret = "";
		if (hrs > 0) {
			ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
		}
		ret += "" + mins + ":" + (secs < 10 ? "0" : "");
		ret += "" + secs;
		return ret;
	}
}