import { createTransport } from 'nodemailer';
import { getStorageApiEndpoint } from '../util/helpers/file';

const adminMail = 'hoangviethung071195@gmail.com';
const transport = createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: adminMail,
    pass: 'flnewxytjyfxywls'
  }
});

const { sendMail } = transport;

const sendOrderInfoToMail = (email: string, fullName: string, phone: string, address: string, products) => {
  console.log('sendOrderInfoToMail');
  transport.sendMail({
    from: '"Việt Hùng Hoàng" <hoangviethung071195@gmail.com>',
    to: `${email}, ${email}`,
    subject: 'Đơn đặt hàng',
    html: `
      <div style="background-color: rgb(36, 36, 36); color: white;">
      <h1 style="color: white;">
        xin chào ${fullName}
      </h1>
  
      <h3 style="color: white;">
        Phone: ${phone}
      </h3>
  
      <h3 style="color: white;">
        Adress: ${address}
      </h3>
  
      <table>
        <thead>
          <tr>
            <th style="border: 1px solid rgb(148, 148, 148);">Tên sản phẩm</th>
            <th style="border: 1px solid rgb(148, 148, 148);">Hình ảnh</th>
            <th style="border: 1px solid rgb(148, 148, 148);">Giá</th>
            <th style="border: 1px solid rgb(148, 148, 148);">Số lượng</th>
            <th style="border: 1px solid rgb(148, 148, 148);">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
        ${products.map(({ product, quantity }) => (
      `
        <tr>
          <th style="border: 1px solid rgb(148, 148, 148);">${product.title}</th>
          <th style="border: 1px solid rgb(148, 148, 148);">
          <img
            width="100px"
            src="${getStorageApiEndpoint() + '/' + product.fileIds[0]}"
            alt=""
          >
          </th>
          <th style="border: 1px solid rgb(148, 148, 148);">${(new Intl.NumberFormat("vi-VI", { style: 'currency', currency: 'VND', })).format(product.price)}</th>
          <th style="border: 1px solid rgb(148, 148, 148);">${quantity}</th>
          <th style="border: 1px solid rgb(148, 148, 148);">${(new Intl.NumberFormat("vi-VI", { style: 'currency', currency: 'VND', })).format(quantity * product.price)}</th>
        </tr>
      `
    ))
      }
  
        </tbody>
      </table>
  
      <h1>Tổng thanh toán:</h1>
      <h1>${(new Intl.NumberFormat("vi-VI", { style: 'currency', currency: 'VND', })).format(products.reduce((a, b) => a + +b.product.price * b.quantity, 0))}</h1>
      <h1>Cảm ơn bạn!</h1>
    </div>
  `
  });
};

const sendCustomerInfo = (email: string, fullName: string, message: string) => {
  console.log('sendCustomerInfo', email);
  return transport.sendMail({
    from: `"${fullName}" <${email}>`,
    to: `${adminMail}, ${adminMail}`,
    subject: 'Customer',
    html: `
    <div>
      From: ${email}
    </div>
    <div>
      Full Name: ${fullName}
    </div>
    <div>
      Message: ${message}
    </div>
    `
  });
};

export {
  sendMail,
  sendCustomerInfo,
  sendOrderInfoToMail, transport
};

