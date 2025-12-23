const React = require('react');
const { Document, Page, Text, View, StyleSheet, renderToBuffer } = require('@react-pdf/renderer');

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 12 },
  header: { marginBottom: 20, borderBottom: '1px solid #eee', paddingBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold' },
  clientInfo: { marginTop: 20, marginBottom: 20 },
  table: { marginTop: 20 },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000', paddingBottom: 5, fontWeight: 'bold' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee', paddingTop: 5, paddingBottom: 5 },
  col1: { width: '60%' },
  col2: { width: '20%', textAlign: 'right' },
  col3: { width: '20%', textAlign: 'right' },
  total: { marginTop: 20, textAlign: 'right', fontSize: 16, fontWeight: 'bold' },
});

const generateInvoicePdf = async (invoice) => {
  const element = React.createElement(Document, null,
    React.createElement(Page, { size: "A4", style: styles.page },
      React.createElement(View, { style: styles.header },
        React.createElement(Text, { style: styles.title }, "INVOICE"),
        React.createElement(Text, null, `Invoice ID: ${invoice.id}`),
        React.createElement(Text, null, `Date: ${new Date(invoice.created_at).toLocaleDateString()}`),
        React.createElement(Text, null, `Due Date: ${new Date(invoice.due_date).toLocaleDateString()}`)
      ),
      React.createElement(View, { style: styles.clientInfo },
        React.createElement(Text, { style: { fontWeight: 'bold' } }, "Bill To:"),
        React.createElement(Text, null, invoice.client_name),
        React.createElement(Text, null, invoice.client_email),
        React.createElement(Text, null, invoice.client_address)
      ),
      React.createElement(View, { style: styles.table },
        React.createElement(View, { style: styles.tableHeader },
          React.createElement(Text, { style: styles.col1 }, "Description"),
          React.createElement(Text, { style: styles.col2 }, "Qty"),
          React.createElement(Text, { style: styles.col3 }, "Price")
        ),
        (invoice.items || []).map((item, index) => 
          React.createElement(View, { key: index, style: styles.tableRow },
            React.createElement(Text, { style: styles.col1 }, item.description),
            React.createElement(Text, { style: styles.col2 }, item.quantity),
            React.createElement(Text, { style: styles.col3 }, `$${parseFloat(item.unit_price).toFixed(2)}`)
          )
        )
      ),
      React.createElement(Text, { style: styles.total }, `Total: $${parseFloat(invoice.total).toFixed(2)}`)
    )
  );

  return await renderToBuffer(element);
};

module.exports = { generateInvoicePdf };
