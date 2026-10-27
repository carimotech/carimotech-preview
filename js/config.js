/* ───────────────────────────────────────────────────────────────────────────
   CARIMO site settings — edit this file only.

   leadEndpoint  Where the brochure-request details (name, email, designation,
                 company) are sent. Paste a Formspree form URL
                 (https://formspree.io/f/xxxxxxxx) or a Google Apps Script
                 web-app URL. While it is empty the form still works, but the
                 details are only kept in the visitor's own browser (testing mode).

   brochures     The files that unlock after the form is submitted.

   packageEmail  The address that the Products page's "Build your own package" button
                 opens in the customer's email app.

   products      robo.in links for the Products page. Paste the full link between the
                 quotes; the "View on robo.in" button appears by itself once a link is
                 there. While a link is empty, that button stays hidden.
   ─────────────────────────────────────────────────────────────────────────── */
window.CARIMO_CONFIG = {
    leadEndpoint: '',
    packageEmail: 'contact@carimo.tech',   // where "Build your own package" requests are emailed
    products: {
        mlk:  { robo: '' },
        dcmk: { robo: '' },
        call: { robo: '' },
        ccll: { robo: '' },
        cue:  { robo: '' }
    },
    brochures: {
        mlk:  { name: 'ML Kit (MLK)',       url: 'https://docs.google.com/presentation/d/1z_lJuK1uEVByBivAFvc03DCzMCOk3rV3e-5QEQT89BA/edit?usp=drive_link' },
        dcmk: { name: 'DC Motor Kit (DCMK)', url: 'https://docs.google.com/presentation/d/1flzu_DalRTU22YDU-0833W_hPkxynL73/edit?usp=drive_link' }
    }
};
