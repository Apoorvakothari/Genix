import { useEffect, useState } from "react";

import IncomeForm from "../../components/income-form";
import IncomesFilterForm from "../../components/income-filter-form";
import * as incomesAPI from "../../api/income";

import "./income.css";

const IncomesPage = () => {
  const [incomes, setIncomes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState({});
  const [totalIncomes, setTotalIncomes] = useState(0);
  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);

  const categories = ["All Categories"];
  for (let i = 0; i < incomes.length; i++) {
    if (!categories.includes(incomes[i].category)) {
      categories.push(incomes[i].category);
    }
  }

  useEffect(() => {
    async function fetchIncomes() {
      try {
        const data = await incomesAPI.getIncomes();
        setIncomes(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchIncomes();
  }, []);

  useEffect(() => {
    let filteredIncomes = incomes.filter((income) => {
      if (selectedCategory !== "" && income.category !== selectedCategory) {
        return false;
      }

      if (
        selectedDateRange.startDate !== "" &&
        selectedDateRange.endDate !== ""
      ) {
        const incomeDate = new Date(income.date);
        const startDate = new Date(selectedDateRange.startDate);
        const endDate = new Date(selectedDateRange.endDate);

        if (incomeDate < startDate || incomeDate > endDate) {
          return false;
        }
      }

      return true;
    });

    let total = 0;
    for (let i = 0; i < filteredIncomes.length; i++) {
      total += filteredIncomes[i].amount;
    }
    setTotalIncomes(total);

    setFilteredIncomes(filteredIncomes);
  }, [incomes, selectedCategory, selectedDateRange]);

  async function addIncome(income) {
    setIncomes((prevIncomes) => [...prevIncomes, income]);
    try {
      const data = await incomesAPI.getIncomes();
      setIncomes(data);
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete(incomeId) {
    try {
      await incomesAPI.deleteIncome(incomeId);
      const data = await incomesAPI.getIncomes();
      setIncomes(data);
    } catch (error) {
      console.error(error);
    }
  }

  function handleToggleModal() {
    setShowModal((prevShowModal) => !prevShowModal);
    setSelectedIncome(null);
  }

  function handleEdit(income) {
    setSelectedIncome(income);
    setShowModal(true);
  }

  function handleCardClick(id) {
    if (expandedCard === id) {
      setExpandedCard(null);
    } else {
      setExpandedCard(id);
    }
  }

  return (
    <div className="income-page">
      <h1 className="heading">Income</h1>
      <div className="row">
        <h1>
          Total Income: <span>${totalIncomes}</span>
        </h1>
        <button onClick={handleToggleModal}>
          <i className="fa-solid fa-plus"></i> Add Income
        </button>
      </div>
      <IncomesFilterForm
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedDateRange={selectedDateRange}
        setSelectedDateRange={setSelectedDateRange}
      />
      <div>
        <ul className="cards-ctr">
          {filteredIncomes.map((income) => (
            <div
              key={income._id}
              onClick={() => handleCardClick(income._id)}
              className={`card ${
                expandedCard === income._id ? "card-expanded" : ""
              }`}
            >
              <div className="green-bar"></div>
              <div className="row">
                <div className="card-main row">
                  <div>
                    <p className="large">{income.description}</p>
                    <p>
                      <i className="fa-solid fa-calendar"></i>&nbsp;
                      {income.date.slice(0, 10)}
                    </p>
                  </div>
                  <p className="large">${income.amount}</p>
                </div>
              </div>
              <div className="row expanded">
                <p>
                  <i className="fa-solid fa-folder"></i>&nbsp;{income.category}
                </p>
                <p>
                  <i className="fa-solid fa-receipt"></i>&nbsp;{income.account}
                </p>
                {income.notes ? (
                  <p>
                    <i className="fa-solid fa-comment"></i>&nbsp;{income.notes}
                  </p>
                ) : null}
                <div className="edit-delete-btns">
                  <button onClick={() => handleDelete(income._id)}>
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <button onClick={() => handleEdit(income)}>
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </ul>
      </div>

      {showModal ? (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleToggleModal}>
              &times;
            </span>
            <IncomeForm
              incomes={incomes}
              setIncomes={setIncomes}
              addIncome={addIncome}
              selectedIncome={selectedIncome}
              setSelectedIncome={setSelectedIncome}
              setShowModal={setShowModal}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default IncomesPage;
