import React, { Fragment } from "react";
import { Table, Alert, TabPane, Button, UncontrolledTooltip } from "reactstrap";
import { FaInfoCircle } from "react-icons/fa";
import NoData from "../../assets/sad.svg";
import Moment from "react-moment";

const PaidTable = invoiceData => {
	const tableExists = data => {
		for (let index in data) {
			if (data[index].invoiceStatus === 6) {
				return true;
			}
		}
		return false;
	};
	var i = 0;
	return (
		<TabPane tabId="3">
			{tableExists(invoiceData.invData) ? (
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
								<th>Status</th>
							</tr>
						</thead>
						<tbody>
							{invoiceData.invData.map((invData, index) => (
								<Fragment key={index}>
									{(() => {
										switch (invData.invoiceStatus) {
											case 6:
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
																	<Alert
																		className="m-0 w-100 p-2"
																		color="success"
																	>
																		Paid
																	</Alert>
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
							<img src={NoData} className="no__data--logo" alt="No Data Found" />
							<p className="no__data--text mt-4">SORRY! NO DATA FOUND</p>
						</div>
					</Fragment>
				)}
		</TabPane>
	);
};

export default PaidTable;
