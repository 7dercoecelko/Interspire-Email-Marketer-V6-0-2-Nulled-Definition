export default function clean(string) {

	// Dasherizes, which also makes it lowercase
	let cleaned = string.dasherize();

	// and remove special (but normally safe) chars
	// remember not do remove hyphens ----
	return cleaned.replace(/[`~!@#$%^&*()_|+=?;:'",.<>\{\}\[\]\\\/]/gi, '');
}
