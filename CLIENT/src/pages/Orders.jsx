import { Package, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

import EmptyState from "../components/EmptyState";

import {
    GetMyOrders
} from "../features/order/orderThunk";

import {
    useAppDispatch,
    useAppSelector
} from "../hooks/reduxHooks";


const money = (value) =>
    new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(Number(value || 0));


export function Orders() {

    const dispatch = useAppDispatch();


    const {

        myOrders,

        loading,

        error

    } = useAppSelector(
        (state) => state.order
    );


    useEffect(() => {

        dispatch(GetMyOrders());

    }, [dispatch]);


    if (loading) {

        return (

            <main className="page">

                <section className="section">

                    <div className="container">

                        <div
                            className="skeleton"
                            style={{
                                height: 300,
                                borderRadius: 8
                            }}
                        />

                    </div>

                </section>

            </main>

        );

    }


    return (

        <main className="page">

            <section className="section">

                <div className="container">

                    <span className="eyebrow">

                        My Orders

                    </span>


                    <h1 className="title">

                        Order history

                    </h1>

                    <Link className="btn btn-secondary" to="/returns" style={{ marginTop: 12 }}>
                        <RotateCcw size={16} /> Track return requests
                    </Link>


                    {error && (

                        <p
                            className="subtitle"
                            style={{
                                marginTop: 16
                            }}
                        >

                            {error}

                        </p>

                    )}


                    {myOrders.length === 0 ? (

                        <div
                            style={{
                                marginTop: 24
                            }}
                        >

                            <EmptyState

                                icon={
                                    <Package />
                                }

                                title="No orders yet"

                                text="Your order timeline will appear after checkout."

                                action={

                                    <Link
                                        className="btn btn-primary"
                                        to="/products"
                                    >

                                        Start Shopping

                                    </Link>

                                }

                            />

                        </div>

                    ) : (

                        <div
                            className="table-wrap"
                            style={{
                                marginTop: 24
                            }}
                        >

                            <table className="table">

                                <thead>

                                    <tr>

                                        <th>
                                            Order
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Total
                                        </th>

                                        <th>
                                            Date
                                        </th>

                                        <th />

                                    </tr>

                                </thead>


                                <tbody>

                                    {myOrders.map(
                                        (order) => (

                                            <tr
                                                key={
                                                    order._id
                                                }
                                            >

                                                <td>

                                                    {
                                                        order.orderNumber ||
                                                        order._id
                                                    }

                                                </td>


                                                <td>

                                                    <span className="badge">

                                                        {
                                                            order.orderStatus ||
                                                            order.status ||
                                                            "placed"
                                                        }

                                                    </span>

                                                </td>


                                                <td>

                                                    {
                                                        money(
                                                            order.totalPrice ||
                                                            order.total ||
                                                            order.totalAmount
                                                        )
                                                    }

                                                </td>


                                                <td>

                                                    {
                                                        order.createdAt
                                                            ? new Date(
                                                                order.createdAt
                                                            ).toLocaleDateString()
                                                            : "-"
                                                    }

                                                </td>


                                                <td>

                                                    <Link

                                                        className="btn btn-secondary"

                                                        to={`/orders/${order._id}`}

                                                    >

                                                        Details

                                                    </Link>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </section>

        </main>

    );

}
