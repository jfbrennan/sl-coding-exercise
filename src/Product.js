import React from 'react';
import './Product.css';
import Chart from "./Chart";
import products from './Webdev_data2'
const retch = window.retch;

class Product extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      product: {},
      retailSales: []
    };
  }

  componentDidMount() {
    const productId = 'B007TIE0GQ'; // ID of the mock product data
    const product = products.find(product => product.id === productId);
    this.setProduct(product)
    //this.fetchProductData(productId).then(product => this.setProduct(product));
  }

  // If there was a Product Service...
  fetchProductData(id) {
    this.setState({loading: true});
    const productServiceBaseUrl = '';
    return retch.get(`${productServiceBaseUrl}/products`, {id})
      .then(product => product)
      .catch(error => this.setState({error}))
      .finally(() => this.setState({loading: false}))
  }

  setProduct(product) {
    if (product.sales) {
      const retailSales = product.sales.map(sale => {
        // Fake last year's sales because the mock data doesn't have it
        return {date: sale.weekEnding, ThisYear: sale.retailSales, LastYear: sale.retailSales - 500000}
      });

      // Format dates and amounts
      product.sales.forEach(sale => {
        sale.weekEnding = this.formatDate(sale.weekEnding);
        sale.retailSales = this.formatAmount(sale.retailSales);
        sale.wholesaleSales = this.formatAmount(sale.wholesaleSales);
        sale.retailerMargin = this.formatAmount(sale.retailerMargin);
      });

      this.setState({product, retailSales});
    }
  }

  // In the interest of time I did not address all the edge cases when handling dates
  formatDate(val) {
    // return new Intl.DateTimeFormat('en-US', {year: '2-digit', month: '2-digit', day: '2-digit'})
    //   .formatToParts(new Date(val.replace(/-/g, '\/'))) // The off-by-one fix
    //   .filter(p => p.type !== 'literal')
    //   .map(p => p.value)
    //   .join('-')

    // Decided on this two-liner instead
    const [yr, mo, day] = val.split('-');
    return [mo, day, yr.slice(-2)].join('-');
  }

  formatAmount(amount) {
    return new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 0})
      .format(amount)
  }

  render() {
    return <div>
      <m-row>
        <m-col span="3 sm-12" class="sm-screen-pad-b-lg">
          <m-box class="shadow full-height pad-all-none">
            <sl-product-summary class="block pad-t-lg">
              <img src={this.state.product.image} alt="{state.product.title}" className="block"/>
              <h4 className="txt-center">{this.state.product.title}</h4>
              <p className="txt-center txt-muted fnt-light pad-l-md pad-r-md">{this.state.product.subtitle}</p>
            </sl-product-summary>
            <hr/>
            <div className="pad-all-sm pad-t-xs">
              {this.state.product.tags && this.state.product.tags.map((tag, i) =>
                <m-tag key={i}>{tag}</m-tag>
              )}
            </div>
            <hr/>
            <nav>
              <a href="/overview" className="block pad-all-md txt-upper txt-muted">
                <m-icon name="home" class="mar-r-sm"></m-icon>Overview
              </a>
              <a href="/sales" className="block pad-all-md txt-upper txt-muted active">
                <m-icon name="chart" class="mar-r-sm"></m-icon>Sales
              </a>
            </nav>
          </m-box>
        </m-col>
        <m-col span="9 sm-12">
          <m-box class="light-shadow">
            <h3 className="mar-t-none fnt-light">Retail Sales</h3>
            <Chart data={this.state.retailSales}/>
          </m-box>
          <m-box class="light-shadow">
            <table>
              <thead>
              <tr>
                <td className="txt-upper">Week ending <m-icon name="arrow-down" class="mar-l-sm txt-xs txt-muted"></m-icon></td>
                <td className="txt-upper txt-right">Retail sales <m-icon name="arrow-down" class="mar-l-sm txt-xs txt-muted"></m-icon></td>
                <td className="txt-upper txt-right">Wholesale sales <m-icon name="arrow-down" class="mar-l-sm txt-xs txt-muted"></m-icon></td>
                <td className="txt-upper txt-right">Units sold <m-icon name="arrow-down" class="mar-l-sm txt-xs txt-muted"></m-icon></td>
                <td className="txt-upper txt-right">Retailer margin <m-icon name="arrow-down" class="mar-l-sm txt-xs txt-muted"></m-icon>
                </td>
              </tr>
              </thead>
              <tbody>
              {this.state.product.sales && this.state.product.sales.map((sale, i) =>
                <tr key={i}>
                  <td>{sale.weekEnding}</td>
                  <td className="txt-right">{sale.retailSales}</td>
                  <td className="txt-right">{sale.wholesaleSales}</td>
                  <td className="txt-right">{sale.unitsSold}</td>
                  <td className="txt-right">{sale.retailerMargin}</td>
                </tr>
              )}
              </tbody>
            </table>
          </m-box>
        </m-col>
      </m-row>
    </div>
  }
}

export default Product;