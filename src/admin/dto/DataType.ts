export default class dataType{
    private _key: number;
    private _failureRate: number;

    /**
     * Getter key
     * @return {number}
     */
	public get key(): number {
		return this._key;
	}

    /**
     * Getter failureRate
     * @return {number}
     */
	public get failureRate(): number {
		return this._failureRate;
	}

    /**
     * Setter key
     * @param {number} value
     */
	public set key(value: number) {
		this._key = value;
	}

    /**
     * Setter failureRate
     * @param {number} value
     */
	public set failureRate(value: number) {
		this._failureRate = value;
	}

}