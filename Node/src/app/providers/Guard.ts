// Prevzato z jineho projektu
export class Guard
{
	public static HasProperty<X extends unknown, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown>
	{
		return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	public static HasNumberProperty<X extends unknown, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, number>
	{
		return Object.prototype.hasOwnProperty.call(obj, prop) && typeof (obj as never)[prop] === "number";
	}

	public static HasStringProperty<X extends unknown, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, string>
	{
		return Object.prototype.hasOwnProperty.call(obj, prop) && typeof (obj as never)[prop] === "string";
	}

	public static HasNullableStringProperty<X extends unknown, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, string | null>
	{
		return Object.prototype.hasOwnProperty.call(obj, prop) && (typeof (obj as never)[prop] === "string" || (obj as never)[prop] == null);
	}

	public static HasBooleanProperty<X extends unknown, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, boolean>
	{
		return Object.prototype.hasOwnProperty.call(obj, prop) && typeof (obj as never)[prop] === "boolean";
	}

	public static SafeGetObject<T>(obj: T | null): T
	{
		if (obj == null)
		{
			throw new Error("Got null on safe get operation.");
		}
		else
		{
			return obj;
		}
	}
}
