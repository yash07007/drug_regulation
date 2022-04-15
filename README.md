# DrugRegulation

### UI Interfaces

### Developer Interface: Gateway to all other interfaces.

### Committee Interface: Interface for Regulatory Committee.

    - Can register new Manufacturer
    - Can see registered manufacturer
    - Can see deployed contracts

### Manufacturer Interface: Interface for Product Manufacturer.

    - Can register new Product Batch
    - Can register new Wholesaler
    - Can Request Product Certification
    - Can see registered Product Batch Contracts
    - Can see registered Wholesaler
    - Can see Certificate Inventory with status of each certificate

### Certifier Interface: Interface for Product Certifier.

    - Can Approve or Reject certifiaction request
    - Can see certification requests from manufactureres

### Wholesaler Interface: Interface for Product Wholesaler.

    - Can buy from market
    - Can register new Retailer
    - Can see product inverntory
    - Can see products available for sale in market
    - Can see registered Retailer
    - Can see Recieved and Sent Invoices for product
    - Can see Sent Purcahse Requests for product

### Retailer Interface: Interface for Product Retailer.

    - Can buy from market
    - Can see product inverntory
    - Can see products available for sale in market
    - Can see Recieved Invoices for product
    - Can see Sent Purcahse Requests for product

## Supply Chain flow

![Developer Interface](https://github.com/yash07007/DrugRegulation/blob/master/ui/0.png?raw=true)
_0. Developer Interface: Gateway to all other interfaces_

---

![alt text](https://github.com/yash07007/DrugRegulation/blob/master/ui/1.png?raw=true)
_1. Committee Interface: Committee registers two manufacturers A Industries & B Industries_

---

![alt text](https://github.com/yash07007/DrugRegulation/blob/master/ui/2_1.png?raw=true)
_2_1. Manufacturer Interface: Manufacturer A Industries requests for certifiaction of product (HCL & H2SO4)_

---

![alt text](https://github.com/yash07007/DrugRegulation/blob/master/ui/2_2.png?raw=true)
_2_2. Manufacturer Interface: Manufacturer B Industries requests for certifiaction of product (HCL & H2SO4)_

---

![alt text](https://github.com/yash07007/DrugRegulation/blob/master/ui/2_3.png?raw=true)
_2_3. Certifier Interface: Certifer accepts & rejects requests by setting production limits as shown_

---

![alt text](https://github.com/yash07007/DrugRegulation/blob/master/ui/3_1.png?raw=true)
_3_1. Manufacturer Interface: Manufacturer A Industries registers a new batch of product as shown_

---

![alt text](https://github.com/yash07007/DrugRegulation/blob/master/ui/3_2.png?raw=true)
_3_2. Manufacturer Interface: Manufacturer B Industries registers a new batch of product as shown_

---

![alt text](https://github.com/yash07007/DrugRegulation/blob/master/ui/4_1.png?raw=true)
_4_1. Manufacturer Interface: Manufacturer A Industries registers a new Wholsaler X Chemicals_

---

![alt text](https://github.com/yash07007/DrugRegulation/blob/master/ui/4_2.png?raw=true)
_4_2. Manufacturer Interface: Manufacturer B Industries registers a new Wholsaler Y Chemicals_

---

![alt text](https://github.com/yash07007/DrugRegulation/blob/master/ui/5_1.png?raw=true)
_5_1. Wholesaler Interface: Wholesaler X Chemicals can see products sold by all manufacutrers_

---

![alt text](https://github.com/yash07007/DrugRegulation/blob/master/ui/5_2.png?raw=true)
_5_2. Wholesaler Interface: Wholesaler Y Chemicals can see products sold by all manufacutrers_

---

![alt text](https://github.com/yash07007/DrugRegulation/blob/master/ui/5_3.png?raw=true)
_5_3. Wholesaler Interface: Wholesalers buys nessasary batches of product they need_

---

![alt text](https://github.com/yash07007/DrugRegulation/blob/master/ui/6_1.png?raw=true)
_6_1. Manufacturer Interface: Manufacturer A Industries can see its Recieved Purchase Requests and it Approves the purcahse requests_

---

![alt text](https://github.com/yash07007/DrugRegulation/blob/master/ui/6_2.png?raw=true)
_6_2. Manufacturer Interface: Manufacturer B Industries can see its Recieved Purchase Requests and it Approves the purcahse requests_

---

![alt text](https://github.com/yash07007/DrugRegulation/blob/master/ui/6_3.png?raw=true)
_6_3. Wholesaler Interface: Wholesaler X Chemicals can see its Sent Purchase Requests and its status [Approved]_

---

![alt text](https://github.com/yash07007/DrugRegulation/blob/master/ui/6_4.png?raw=true)
_6_4. Wholesaler Interface: Wholesaler Y Chemicals can see its Sent Purchase Requests and its status [Approved]_

---

![alt text](https://github.com/yash07007/DrugRegulation/blob/master/ui/7_1.png?raw=true)
_7_1. Wholesaler Interface: Wholesaler X Chemicals can see its Recieved Invocies which it pays_

---

![alt text](https://github.com/yash07007/DrugRegulation/blob/master/ui/7_2.png?raw=true)
_7_2. Wholesaler Interface: Wholesaler Y Chemicals can see its Recieved Invocies which it pays_

---

![alt text](https://github.com/yash07007/DrugRegulation/blob/master/ui/7_3.png?raw=true)
_7_3. Manufacturer Interface: Manufacturer A Industries can see status of its Sent Invocies [Paid]_

---

![alt text](https://github.com/yash07007/DrugRegulation/blob/master/ui/7_4.png?raw=true)
_7_4. Manufacturer Interface: Manufacturer B Industries can see status of its Sent Invocies [Paid]_

---

![alt text](https://github.com/yash07007/DrugRegulation/blob/master/ui/8_1.png?raw=true)
_8_1. Wholesaler Interface: Wholesaler X Chemicals registers a new Retailer P Labs with subset of owned profduct batch contracts_

---

![alt text](https://github.com/yash07007/DrugRegulation/blob/master/ui/8_2.png?raw=true)
_8_2. Wholesaler Interface: Wholesaler Y Chemicals registers a new Retailer P Labs with subset of owned profduct batch contracts_

---

![alt text](https://github.com/yash07007/DrugRegulation/blob/master/ui/9.png?raw=true)
_9. Retailer Interface: Retailer P Labs can see products sold by wholesalers who have registered it with allowed products_

---

![alt text](https://github.com/yash07007/DrugRegulation/blob/master/ui/10_1.png?raw=true)
_10_1. Wholesaler Interface: Wholesaler X Chemicals can see its Recieved Purchase Requests and it Approves the purcahse request_

---

![alt text](https://github.com/yash07007/DrugRegulation/blob/master/ui/10_2.png?raw=true)
_10_2. Wholesaler Interface: Wholesaler Y Chemicals can see its Recieved Purchase Requests and it Approves the purcahse request_

---

![alt text](https://github.com/yash07007/DrugRegulation/blob/master/ui/10_3.png?raw=true)
_10_3. Retailer Interface: Retailer P Labs can see its Sent Purchase Requests and its status [Accepted]_

---

![alt text](https://github.com/yash07007/DrugRegulation/blob/master/ui/11_1.png?raw=true)
_11_1. Retailer Interface: Retailer P Labs can see its Recieved Invocies which it pays_

---

![alt text](https://github.com/yash07007/DrugRegulation/blob/master/ui/11_2.png?raw=true)
_11_2. Wholesaler Interface: Wholesaler X Chemicals can see status of its Sent Invocies [Paid]_

---

![alt text](https://github.com/yash07007/DrugRegulation/blob/master/ui/11_3.png?raw=true)
_11_3. Wholesaler Interface: Wholesaler Y Chemicals can see status of its Sent Invocies [Paid]_

---
