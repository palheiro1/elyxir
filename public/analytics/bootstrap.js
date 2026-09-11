import { installProductAnalytics, permittedProduct } from './analytics.js';
const config = {"publicKey":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpibWtodnBva29wdmhub2NoY2pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNTU2NTQsImV4cCI6MjA4NjkzMTY1NH0.OSjYzORVd6I8YmeF2uLkE_cE9eN1YED2rtNeCjcrWkw","posthogKey":"phc_t9tUBritYeCwxHKWHWrKau7PHydTR7DqKioBDLDVwvsP","product":"elyxir","mode":"alchemy","appVersion":"d9993be-analytics-20260911","enabled":true,"replayValidated":false};
// A hosting preview is not a published product. Local QA is classified as test.
if (permittedProduct(config.product, config.mode, location.origin)) {
  const analytics = installProductAnalytics(config);
  analytics.setPage(location.pathname, false);
  const destinations = {
    'my.mythicalbeings.io': 'play_hub', 'dev.mythicalbeings.io': 'play_hub',
    'wisdomduel.mythicalbeings.io': 'wisdom_duel', 'bestiarytrails.mythicalbeings.io': 'bestiary_trails',
    'wiki.mythicalbeings.io': 'wiki', 'contest.mythicalbeings.io': 'contest',
    'elyxir.mythicalbeings.io': 'elyxir',
  };
  document.addEventListener('click', event => {
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!link) return;
    const url = new URL(link.href, location.href);
    const destination = url.origin === location.origin ? config.product : destinations[url.hostname];
    if (!destination || !['http:', 'https:'].includes(url.protocol)) return;
    const submitting = config.product === 'contest' && url.origin === location.origin && /^\/submit\/?$/.test(url.pathname);
    if (url.origin !== location.origin || submitting) {
      analytics.track('cta_clicked', {cta: submitting ? 'contest' : destination === 'wiki' ? 'learn' : 'play', destination});
    }
  });
  // Applications can emit only the closed vocabulary; never pass an operation
  // response, a form payload or a user identifier through this bridge.
  window.addEventListener('mythical-product-event', event => {
    if (!(event instanceof CustomEvent) || !event.detail) return;
    const {name, properties} = event.detail;
    analytics.track(name, properties || {});
  });
}
