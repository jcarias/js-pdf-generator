import React, { Component } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import "./App.css";

class App extends Component {
  state = {
    data: {
      name: "",
      receiptId: 0,
      price1: 0,
      price2: 0
    },
    loading: false
  };

  handleChange = ({ target: { value, name } }) => {
    this.setState({
      ...this.state,
      data: { ...this.state.data, [name]: value }
    });
  };

  createAndDownloadPdf = () => {
    this.setState({ loading: true });
    axios
      .post("/create-pdf", this.state.data)
      .then(() => axios.get("/fetch-pdf", { responseType: "blob" }))
      .then(res => {
        this.setState({ loading: false });
        const pdfBlob = new Blob([res.data], { type: "application/pdf" });
        saveAs(pdfBlob, "newPdf.pdf");
      })
      .catch(err => {
        console.error(err);
        this.setState({ loading: false });
      });
  };

  render() {
    return (
      <div className="App">
        <input
          type="text"
          placeholder="Name"
          name="name"
          onChange={this.handleChange}
        />
        <input
          type="number"
          placeholder="Receipt ID"
          name="receiptId"
          onChange={this.handleChange}
        />
        <input
          type="number"
          placeholder="Price 1"
          name="price1"
          onChange={this.handleChange}
        />
        <input
          type="number"
          placeholder="Price 2"
          name="price2"
          onChange={this.handleChange}
        />
        <button onClick={this.createAndDownloadPdf}>Download PDF</button>

        {this.state.loading && "Generating PDF...please wait."}
      </div>
    );
  }
}

export default App;
