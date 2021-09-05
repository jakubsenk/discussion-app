// Prevzato z jineho projektu
import { QueueData } from "../models/QueueData";
import * as $ from "jquery";
// import IVueApp from "@/Shared/interfaces/IVueApp";
// import { ToastMutations } from "@/Shared/store/modules/toasts";
// import { Toast } from "@/Shared/models/Toast";
// import { LoaderMutations } from "@/Shared/store/modules/loader";

export class RestProvider
{
	static Username: string | null = null;
	static Password: string | null = null;
	static IsAdminContext: boolean | "superuser" = false;
	static AccessToken: string | null = null;
	static RefreshToken: string | null = null;
	static UploadImage = false;
	static Traditional = false;
	static Pending = false;
	static PendingAT = false;
	static Queue: Array<QueueData> = [];
	static TokenTimer: number | undefined;

	static GetData(
		url: string,
		body: string | Object | null,
		onDone: ((data: unknown) => void) | null,
		onFail: (response: JQuery.jqXHR) => boolean | null,
		noAuth = false
	): void
	{
		const queueData: QueueData = {
			Url: url,
			Body: typeof body !== "object" ? "=" + body : body,
			NoAuth: noAuth,
			OnDone: onDone,
			OnFail: onFail
		};
		if (this.AccessToken == null && this.Username != null && this.Password != null && !noAuth && this.Queue.length === 0 && !this.PendingAT)
		{
			console.dir("GetData: access token is null");
			if (this.RefreshToken != null)
			{
				this.Queue.push(queueData);
				// this.GetRefreshToken(queueData);
				console.dir("Exiting GetData method!");
			}
			else
			{
				this.Queue.push(queueData);
				// this.GetAccessToken(queueData.OnFail);
				console.dir("Exiting GetData method!");
			}
		}
		else
		{
			this.Queue.push(queueData);
			if (!this.Pending && !this.PendingAT && this.Queue.length === 1)
			{
				console.dir("Entering GetResponse.");
				this.GetResponse();
			}
		}
	}

	static GetResponse(refreshed = false): void
	{
		console.debug("Begin GetResponse, current queue:", JSON.parse(JSON.stringify(this.Queue)));
		const queueData = this.Queue.shift();
		if (queueData == null)
		{
			throw new Error("QueueData cant be null here");
		}
		console.debug("data to send: ", queueData);

		if (this.AccessToken == null && this.Username != null && this.Password != null && !queueData.NoAuth && !this.PendingAT)
		{
			console.dir("GetResponse: access token is null");
			if (this.RefreshToken != null)
			{
				this.Queue.unshift(queueData);
				// this.GetRefreshToken(queueData);
				console.dir("Exiting GetResponse method!");
			}
			else
			{
				this.Queue.unshift(queueData);
				// this.GetAccessToken(queueData.OnFail);
				console.dir("Exiting GetResponse method!");
			}
		}
		else
		{
			let aj;
			this.Pending = true;
			if (this.UploadImage)
			{
				console.dir("Performing file upload...");
				aj = $.ajax({
					url: queueData.Url,
					type: "POST",
					data: queueData.Body as Object,
					contentType: false,
					cache: false,
					processData: false,
					headers: this.AccessToken && !queueData.NoAuth ? { Authorization: "bearer " + this.AccessToken } : {}
				});
				this.UploadImage = false;
			}
			else
			{
				const config: Object = {
					url: queueData.Url,
					method: "post",
					// accept: "application/json",
					data: queueData.Body,
					headers:
						this.AccessToken && !queueData.NoAuth
							? { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8", Authorization: "bearer " + this.AccessToken }
							: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
					traditional: this.Traditional
				};
				aj = $.ajax(config);
			}

			this.Traditional = false;

			aj.done((data: unknown) =>
			{
				this.Pending = false;
				if (typeof queueData.OnDone === "function")
				{
					try
					{
						queueData.OnDone(data);
					}
					catch (error)
					{
						console.error(error);
						// this.vm.HandleRestError(new RestError(queueData, data, error));
					}
				}
				if (this.Queue.length > 0 && !this.PendingAT)
				{
					console.dir("Queue is not empty, entering GetResponse");
					this.GetResponse();
				}
			}).fail((response: JQuery.jqXHR) =>
			{
				this.Pending = false;
				if (response && response.status === 401 && response.statusText === "Unauthorized" && this.RefreshToken && !refreshed && !queueData.NoAuth)
				{
					this.Queue.unshift(queueData);
					// this.GetRefreshToken(queueData);
				}
				else if (response && response.status === 205)
				{
					// this.vm.$store.commit(LoaderMutations.ADD_GLOBAL_LOADING);
					// this.vm.$store.commit(ToastMutations.PUSH_TOAST, new Toast("Probíhá načtení nové verze...", 10000, "", [], false));
					// setTimeout(() =>
					// {
					// 	window.location.reload();
					// }, 3000);
				}
				else
				{
					let handled = false;
					let err;
					try
					{
						if (typeof queueData.OnFail === "function" && queueData.OnFail(response))
						{
							handled = true;
						}
						else if (response.responseJSON && response.responseJSON.Message === "Authorization has been denied for this request.")
						{
							// this.vm.$store.commit(
							// 	ToastMutations.PUSH_TOAST,
							// 	new Toast("Došlo k chybě autorizace, prosím, obnovte stránku a zkuste to znovu.", Infinity, "materialize-red", [], false)
							// );
							// handled = true;
						}
					}
					catch (error)
					{
						console.dir(error);
						err = error;
					}
					if (!handled)
					{
						console.dir(response);
						// this.vm.HandleRestError(new RestError(queueData, response, err));
					}
					if (this.Queue.length > 0 && !this.PendingAT) this.GetResponse();
				}
			});
		}
	}
}
