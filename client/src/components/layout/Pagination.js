import React, { Fragment } from "react";
import { Pagination, PaginationLink, PaginationItem } from "reactstrap";

const CustomPagination = ({ invoicesPerPage, totalInvoices, paginate }) => {
	const pageNumbers = [];
	for (let i = 1; i <= Math.ceil(totalInvoices / invoicesPerPage); i++) {
		pageNumbers.push(i);
	}

	return (
		<Fragment>
			<Pagination aria-label="Page navigation example">
				{pageNumbers.map(number => (
					<PaginationItem key={number}>
						<PaginationLink
							href={"?page=" + number}
							onClick={e => paginate(e, number)}
						>
							{number}
						</PaginationLink>
					</PaginationItem>
				))}
			</Pagination>
		</Fragment>
	);
};

export default CustomPagination;
