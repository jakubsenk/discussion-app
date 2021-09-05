export class QueueData
{
	public Url: string;
	public Body: string | Object | null;
	public NoAuth: boolean;
	public OnDone: Function | null;
	public OnFail: Function | null;

	constructor(url: string, body: string | Object | null = null, onDone: Function | null = null, onFail: Function | null = null, noAuth = false)
	{
		this.Url = url;
		this.Body = body;
		this.OnDone = onDone;
		this.OnFail = onFail;
		this.NoAuth = noAuth;
	}
}
