import React, { useState, Fragment } from "react";
import {
	Container,
	Table,
	Button,
	UncontrolledTooltip,
	Form,
	FormGroup,
	Label,
	Input,
	UncontrolledPopover,
	PopoverHeader,
	PopoverBody,
	Alert
} from "reactstrap";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import CustomPagination from "../layout/Pagination";
import { connect } from "react-redux";
import Spinner from "../../components/layout/Spinner";
import CustomAlert from "../layout/Alert";
import { FiXCircle } from "react-icons/fi";
import { FiCheckCircle } from "react-icons/fi";
import { FiDownload } from "react-icons/fi";
import { FaInfoCircle } from "react-icons/fa";
import { acceptInvoice } from "../../actions/update";
import { rejectInvoice } from "../../actions/update";
import Moment from "react-moment";

const Dashboard = ({
	auth: { loading },
	invoices: { invoiceLoading, invoiceData },
	acceptInvoice,
	rejectInvoice
}) => {
	const [otherReason, setOtherReason] = useState(false);
	const [invoicesPerPage] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [formData, setFormData] = useState({
		reason: "",
		customReason: ""
	});
	let history = useHistory();
	// Change page
	const paginate = (e, pageNumber) => {
		e.preventDefault();
		setCurrentPage(pageNumber);
		let pageNumberQuery = e.target.href;
		pageNumberQuery = pageNumberQuery.split("?");
		history.push(`?${pageNumberQuery[1]}`);
	};
	const onAccept = async (e, data) => {
		e.preventDefault();
		acceptInvoice(data._id);
	};
	const { reason, customReason } = formData;
	const onChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	const onRejectChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
		if (e.target.value === "custom") {
			setOtherReason(true);
		} else {
			setOtherReason(false);
		}
	};
	const onReject = async (e, data) => {
		e.preventDefault();
		if (customReason !== "") {
			rejectInvoice(data._id, customReason);
			setOtherReason(false);
		} else if (reason !== "") {
			rejectInvoice(data._id, reason);
		} else {
			rejectInvoice(data._id, e.target.reason.value);
		}
		setFormData({
			reason: "",
			customReason: ""
		});
	};
	const getInvoices = (loading, data) => {
		if (data !== null) {
			// Get current invoices
			const indexOfLastInvoice = currentPage * invoicesPerPage;
			const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
			const currentInvoices = data.slice(
				indexOfFirstInvoice,
				indexOfLastInvoice
			);
			return (
				<Fragment>
					<Table id="invoiceTable" responsive bordered hover>
						<thead>
							<tr>
								<th>#</th>
								<th>Name</th>
								<th>Email</th>
								<th>Subject</th>
								<th>Amount</th>
								<th>Date</th>
								<th>File</th>
								<th>Remark</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{currentInvoices.map((invData, index) => (
								<tr key={index}>
									<th scope="row">{index + 1}</th>
									<td>{invData.name}</td>
									<td>{invData.email}</td>
									<td>
										<Button id={"subject-" + index} color="info" outline>
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
										<Moment format="DD-MMM-YYYY">{invData.billDate}</Moment>
									</td>
									<td>
										<a href={invData.billDoc} className="bill__download--link">
											<Button color="primary" block outline>
												<FiDownload />
											</Button>
										</a>
									</td>
									<td>
										<Button id={"remark-" + index} color="info" outline>
											<FaInfoCircle />
										</Button>
									</td>
									<UncontrolledTooltip
										placement="top"
										target={"remark-" + index}
									>
										{!invData.billRemark ? "N/A" : invData.billRemark}
									</UncontrolledTooltip>
									<td className="action__table--content">
										<div className="accept__reject">
											{(() => {
												switch (invData.invoiceStatus) {
													case 2:
														return (
															<Fragment>
																<Button
																	color="success"
																	className="accept__btn"
																	onClick={e => onAccept(e, invData)}
																>
																	<FiCheckCircle />
																</Button>
																<Button
																	id={"reject-" + index}
																	color="danger"
																	className="reject__btn"
																>
																	<FiXCircle />
																</Button>
																<UncontrolledPopover
																	trigger="legacy"
																	placement="left"
																	target={"reject-" + index}
																>
																	<PopoverHeader className="text-center">
																		REJECT INVOICE
																	</PopoverHeader>
																	<PopoverBody>
																		<Form
																			onSubmit={e => onReject(e, invData)}
																		>
																			<FormGroup>
																				<Label for="rejectSelect">
																					SELECT REASON TO REJECT
																				</Label>
																				<Input
																					type="select"
																					name="reason"
																					id="rejectSelect"
																					value={reason}
																					onChange={e => onRejectChange(e)}
																				>
																					<option value="Invalid Invoice">
																						Incorrect invoice
																					</option>
																					<option value="Out of date">
																						Out of date(&gt;7 days)
																					</option>
																					<option value="custom">Other</option>
																				</Input>
																			</FormGroup>
																			{otherReason ? (
																				<Fragment>
																					<FormGroup>
																						<Input
																							type="text"
																							name="customReason"
																							id="customReason"
																							onChange={e => onChange(e)}
																							value={customReason}
																							placeholder="Reason"
																							required
																						/>
																					</FormGroup>
																				</Fragment>
																			) : null}

																			<Button color="danger" block>
																				REJECT
																			</Button>
																		</Form>
																	</PopoverBody>
																</UncontrolledPopover>
															</Fragment>
														);
													case 3:
														return (
															<Fragment>
																<Alert
																	className="m-0 w-100 p-2"
																	color="success"
																>
																	Accepted
																</Alert>
															</Fragment>
														);
													case 4:
														return (
															<Fragment>
																<Alert className="m-0 w-100 p-2" color="danger">
																	Rejected
																</Alert>
															</Fragment>
														);
													case 5:
														return (
															<Fragment>
																<Alert
																	className="m-0 w-100 p-2"
																	color="warning"
																>
																	On Hold
																</Alert>
															</Fragment>
														);
													case 6:
														return (
															<Fragment>
																<Alert className="m-0 w-100 p-2" color="dark">
																	Paid
																</Alert>
															</Fragment>
														);
													default:
														return null;
												}
											})()}
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
					<CustomPagination
						invoicesPerPage={invoicesPerPage}
						totalInvoices={data.length}
						paginate={paginate}
					/>
				</Fragment>
			);
		} else {
			return false;
		}
	};
	return (
		<Fragment>
			<Container className="themed-container" fluid={true}>
				<div className="invoiceData__wrapper">
					<CustomAlert />
					{loading ? (
						<Spinner />
					) : (
							<Fragment>
								{invoiceLoading ? (
									<Spinner />
								) : (
										getInvoices(invoiceLoading, invoiceData)
									)}
							</Fragment>
						)}
				</div>
			</Container>
		</Fragment>
	);
};

Dashboard.propTypes = {
	acceptInvoice: PropTypes.func.isRequired,
	rejectInvoice: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	invoices: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	acceptInvoice: PropTypes.func.isRequired,
	rejectInvoice: PropTypes.func.isRequired,
	auth: state.auth,
	invoices: state.invoices
});

export default connect(mapStateToProps, { acceptInvoice, rejectInvoice })(
	Dashboard
);
