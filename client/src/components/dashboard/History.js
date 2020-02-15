import React, { useState, Fragment } from "react";
import {
	Container,
	TabContent,
	Nav,
	NavItem,
	NavLink,
	Button,
	TabPane,
	Table,
	UncontrolledTooltip
} from "reactstrap";
import Moment from "react-moment";
import Spinner from "../layout/Spinner";
import NoData from "../../assets/sad.svg";
import { MdCheckCircle } from "react-icons/md";
import { FaInfoCircle } from "react-icons/fa";
import PaidTable from "../layout/PaidTable";
import RejectedTable from "../layout/RejectedTable";
import classnames from "classnames";
import { paidInvoice } from "../../actions/update";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const Analytics = ({
	auth: { loading },
	invoices: { invoiceLoading, invoiceData },
	paidInvoice
}) => {
	var [activeTab, setActiveTab] = useState("1");
	const toggle = tab => {
		if (activeTab !== tab) setActiveTab(tab);
	};
	const onPaid = async (e, id) => {
		e.preventDefault();
		paidInvoice(id);
	};

	const tableExists = data => {
		for (let index in data) {
			if (data[index].invoiceStatus === 3) {
				return true;
			}
		}
		return false;
	};

	const getInvoices = (loading, data) => {
		if (data !== null) {
			var i = 0;
			return (
				<Fragment>
					<TabPane tabId="1">
						{tableExists(data) ? (
							<Fragment>
								<Table id="invoiceTable" responsive hover bordered>
									<thead>
										<tr>
											<th>#</th>
											<th>Name</th>
											<th>Email</th>
											<th>Subject</th>
											<th>Amount</th>
											<th>Date</th>
											<th>Action</th>
										</tr>
									</thead>
									<tbody>
										{data.map((invData, index) => (
											<Fragment key={index}>
												{(() => {
													switch (invData.invoiceStatus) {
														case 3:
															return (
																<Fragment>
																	<tr>
																		<th scope="row">{++i}</th>
																		<td>{invData.name}</td>
																		<td>{invData.email}</td>
																		<td>
																			<Button
																				id={"subject-" + index}
																				outline
																				color="info"
																			>
																				<FaInfoCircle />
																			</Button>
																		</td>
																		<UncontrolledTooltip
																			placement="top"
																			target={"subject-" + index}
																		>
																			{invData.billSubject}
																		</UncontrolledTooltip>
																		<td>₹{invData.billAmount}</td>
																		<td className="date__table--content">
																			<Moment format="DD-MMM-YYYY">
																				{invData.billDate}
																			</Moment>
																		</td>
																		<td className="action__table--content">
																			<div className="accept__reject">
																				<Button
																					color="success"
																					className="paid__btn"
																					onClick={e => onPaid(e, invData._id)}
																				>
																					<MdCheckCircle /> Paid
																				</Button>
																			</div>
																		</td>
																	</tr>
																</Fragment>
															);
														default:
															return null;
													}
												})()}
											</Fragment>
										))}
									</tbody>
								</Table>
							</Fragment>
						) : (
								<Fragment>
									<div className="no__data--exists">
										<img
											src={NoData}
											className="no__data--logo"
											alt="No Data Found"
										/>
										<p className="no__data--text mt-4">
											SORRY! NO DATA FOUND
									</p>
									</div>
								</Fragment>
							)}
					</TabPane>
					<RejectedTable invData={data} />
					<PaidTable invData={data} />
				</Fragment>
			);
		}
	};
	return (
		<Fragment>
			<Container className="themed-container">
				<div className="analyticsData__wrapper">
					{!loading ? (
						<Fragment>
							<Nav tabs className="mb-4">
								<NavItem className="m-0">
									<NavLink
										className={classnames({ active: activeTab === "1" })}
										onClick={() => {
											toggle("1");
										}}
									>
										Accepted
									</NavLink>
								</NavItem>
								<NavItem className="m-0">
									<NavLink
										className={classnames({ active: activeTab === "2" })}
										onClick={() => {
											toggle("2");
										}}
									>
										Rejected
									</NavLink>
								</NavItem>
								<NavItem className="m-0">
									<NavLink
										className={classnames({ active: activeTab === "3" })}
										onClick={() => {
											toggle("3");
										}}
									>
										Paid
									</NavLink>
								</NavItem>
							</Nav>
							{invoiceLoading ? (
								<Spinner />
							) : (
									<Fragment>
										<TabContent activeTab={activeTab}>
											{getInvoices(invoiceLoading, invoiceData)}
										</TabContent>
									</Fragment>
								)}
						</Fragment>
					) : (
							<Spinner />
						)}
				</div>
			</Container>
		</Fragment>
	);
};

Analytics.propTypes = {
	auth: PropTypes.object.isRequired,
	invoices: PropTypes.object.isRequired,
	paidInvoice: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	invoices: state.invoices,
	paidInvoice: PropTypes.func.isRequired
});

export default connect(mapStateToProps, { paidInvoice })(Analytics);
