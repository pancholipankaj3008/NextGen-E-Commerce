import {
    FileText,
    PackageCheck
} from "lucide-react";

import {
    useEffect
} from "react";

import {
    useParams
} from "react-router-dom";

import {

    CancelOrder,

    GetSingleOrder

} from "../features/order/orderThunk";

import {

    ClearSingleOrder

} from "../features/order/orderSlice";

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


export function OrderDetails() {

    const { id } = useParams();


    const dispatch = useAppDispatch();


    const {

        order,

        loading,

        actionLoading,

        error

    } = useAppSelector(
        (state) => state.order
    );


    useEffect(() => {

        dispatch(
            GetSingleOrder(id)
        );


        return () => {

            dispatch(
                ClearSingleOrder()
            );

        };

    }, [
        dispatch,
        id
    ]);


    const handleCancelOrder = async () => {

        const result = await dispatch(
            CancelOrder(id)
        );


        if (
            CancelOrder.fulfilled.match(result)
        ) {

            dispatch(
                GetSingleOrder(id)
            );

        }

    };


    if (loading) {

        return (

            <main className="page">

                <section className="section">

                    <div className="container">

                        <div
                            className="skeleton"
                            style={{
                                height: 400,
                                borderRadius: 8
                            }}
                        />

                    </div>

                </section>

            </main>

        );

    }


    if (!order) {

        return (

            <main className="page">

                <section className="section">

                    <div className="container">

                        <span className="eyebrow">

                            Order Details

                        </span>


                        <h1 className="title">

                            Order not found

                        </h1>


                        {error && (

                            <p className="subtitle">

                                {error}

                            </p>

                        )}

                    </div>

                </section>

            </main>

        );

    }


    const status =
        String(
            order.orderStatus || ""
        ).toLowerCase();


    const timeline = [

        "placed",

        "packed",

        "shipped",

        "out for delivery",

        "delivered"

    ];


    const canCancel =
        ![
            "cancelled",
            "shipped",
            "out for delivery",
            "delivered"
        ].includes(status);


    return (

        <main className="page">

            <section className="section">

                <div className="container">


                    <span className="eyebrow">

                        Order Details

                    </span>


                    <h1 className="title">

                        {
                            order.orderNumber ||
                            id
                        }

                    </h1>


                    <div
                        className="grid grid-2"
                        style={{
                            marginTop: 24
                        }}
                    >


                        <div
                            className="card"
                            style={{
                                padding: 24
                            }}
                        >

                            <PackageCheck />


                            <h2 className="product-name">

                                Timeline

                            </h2>


                            {status === "cancelled" ? (

                                <p className="product-meta">

                                    <span className="badge">

                                        cancelled

                                    </span>

                                </p>

                            ) : (

                                timeline.map(
                                    (item) => {

                                        const currentIndex =
                                            timeline.indexOf(status);

                                        const itemIndex =
                                            timeline.indexOf(item);


                                        const reached =
                                            itemIndex <= currentIndex;


                                        return (

                                            <p
                                                key={item}
                                                className="product-meta"
                                            >

                                                <span

                                                    className="badge"

                                                    style={{
                                                        opacity:
                                                            reached
                                                                ? 1
                                                                : 0.55
                                                    }}

                                                >

                                                    {item}

                                                </span>

                                            </p>

                                        );

                                    }
                                )

                            )}

                        </div>


                        <div
                            className="card"
                            style={{
                                padding: 24
                            }}
                        >

                            <FileText />


                            <h2 className="product-name">

                                Invoice

                            </h2>


                            <p className="subtitle">

                                Total: {
                                    money(
                                        order.totalPrice
                                    )
                                }

                                {" | "}

                                Payment: {
                                    order.paymentMethod ||
                                    "-"
                                }

                            </p>


                            <p className="product-meta">

                                Payment Status:{" "}

                                <span className="badge">

                                    {
                                        order.paymentStatus ||
                                        "pending"
                                    }

                                </span>

                            </p>


                            {order.trackingId && (

                                <p className="product-meta">

                                    Tracking ID:{" "}

                                    <strong>

                                        {
                                            order.trackingId
                                        }

                                    </strong>

                                </p>

                            )}


                            {order.estimatedDelivery && (

                                <p className="product-meta">

                                    Estimated Delivery:{" "}

                                    {
                                        new Date(
                                            order.estimatedDelivery
                                        ).toLocaleDateString()
                                    }

                                </p>

                            )}


                            <button

                                className="btn btn-danger"

                                disabled={
                                    !canCancel ||
                                    actionLoading
                                }

                                onClick={
                                    handleCancelOrder
                                }

                            >

                                {
                                    actionLoading
                                        ? "Cancelling..."
                                        : status === "cancelled"
                                            ? "Order Cancelled"
                                            : "Cancel Order"
                                }

                            </button>

                        </div>

                    </div>


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
                                        Product
                                    </th>

                                    <th>
                                        Variant
                                    </th>

                                    <th>
                                        Qty
                                    </th>

                                    <th>
                                        Price
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {(order.orderItems || []).map(
                                    (item) => (

                                        <tr
                                            key={
                                                item._id ||
                                                item.product?._id ||
                                                `${item.title}-${item.color}-${item.size}`
                                            }
                                        >

                                            <td>

                                                {
                                                    item.title ||
                                                    item.tittle ||
                                                    item.product?.title ||
                                                    item.product?.name ||
                                                    "Product"
                                                }

                                            </td>


                                            <td>

                                                {
                                                    [
                                                        item.color,
                                                        item.size
                                                    ]
                                                        .filter(Boolean)
                                                        .join(" / ")
                                                }

                                            </td>


                                            <td>

                                                {
                                                    item.quantity
                                                }

                                            </td>


                                            <td>

                                                {
                                                    money(
                                                        item.price
                                                    )
                                                }

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>


                    {order.shippingAddress && (

                        <div
                            className="card"
                            style={{
                                padding: 24,
                                marginTop: 24
                            }}
                        >

                            <span className="eyebrow">

                                Delivery Address

                            </span>


                            <p className="subtitle">

                                {
                                    [
                                        order.shippingAddress.fullName,

                                        order.shippingAddress.houseNo,

                                        order.shippingAddress.area,

                                        order.shippingAddress.city,

                                        order.shippingAddress.state,

                                        order.shippingAddress.pincode
                                    ]
                                        .filter(Boolean)
                                        .join(", ")
                                }

                            </p>


                            {order.shippingAddress.phone && (

                                <p className="product-meta">

                                    Phone: {
                                        order.shippingAddress.phone
                                    }

                                </p>

                            )}

                        </div>

                    )}

                </div>

            </section>

        </main>

    );

}