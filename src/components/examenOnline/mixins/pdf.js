import { jsPDF } from 'jspdf';

export default {
  methods: {
    initPDF () {
      this.showPDF = true;
      // eslint-disable-next-line new-cap
      this.pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [216, 279]
      });
    },
    /*
    * @author dbarra@agetic.gob.bo
    * @params { html } String
    */
    generatePDF (html) {
      this.pdf.html(html, {
        callback: doc => {
          this.$waiting(false);
          const filename = `${this.$storage.get('rude')}-${this.$storage.get('area')}.pdf`;
          doc.save(filename);
        },
        x: 10,
        y: 10
      });
    }
  }
};
