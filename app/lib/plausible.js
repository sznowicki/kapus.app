import anonymizeIp from 'ip-anonymize';

const anonIp = (ip) => {
	return anonymizeIp(ip);
};

const emitEvent = async (req, name, viewName) => {
	const { env } = req;
	const userAgent = req.get('user-agent');
	let ip = req.get('cf-connecting-ip');

	if (!ip) {
		console.warn('No IP address provided. Falling back to local');
		ip = '127.0.0.1';
	}

	const anonedIp = anonIp(ip);

	const plausibleHeaders = {
		'User-Agent': userAgent,
		'X-Forwarded-For': anonedIp,
		'Content-Type': 'application/json',
	};

	const response = await fetch('https://plausible.io/api/event', {
		headers: plausibleHeaders,
		method: 'POST',
		body: JSON.stringify({
			name,
			url: viewName ? viewName : req.originalUrl,
			domain: env.PLAUSIBLE_REPORTED_DOMAIN,
		}),
	});

	if (response.status !== 202) {
		console.error('Plausible failed', await response.text());
	}
};
/**
 * Emits PageView to Plausible.io
 * Note: this is fully GDPR/Telecom compliant as we anonymize the IP address.
 * Should never throw. Should be fire and forget.
 * @param req
 * @param {string} viewName
 */
export const emitPageView = async (req, viewName) => {
	try {
		await emitEvent(req, 'pageview', viewName);
	} catch (error) {
		console.error('Plausible failed', error);
	}
};
