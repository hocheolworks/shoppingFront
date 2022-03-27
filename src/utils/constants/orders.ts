import { Order } from '../../types/types';

const ConstantOrders: Array<Order> = [
    {
        id: 1234,
        address: 'ABCD',
        city: 'Seoul',
        date: '2022-03-27',
        email: 'JohnDoe@gmail.com',
        firstName: 'John',
        lastName: 'Doe',
        orderItems: [
            {
                id: 1,
                quantity: 10,
                amount: 1000,
                perfume: {
                    id: 11,
                    perfumer: 'Greatest Perfumer',
                    perfumeTitle: 'Shit Smell',
                    price: 100,
                    country: 'South Korea',
                    description: 'JonNa JoEum',
                    year: 2000,
                    type: 'EDT',
                    volume: '120ml',
                    perfumeGender: 'male',
                    fragranceBaseNotes: '',
                    fragranceMiddleNotes: '',
                    fragranceTopNotes: '',
                    filename: '',
                    file: null,
                    perfumeRating: 5,
                    reviews: [],
                },
            },
        ],
        phoneNumber: '010-1234-5678',
        postIndex: 90876,
        totalPrice: 2000,
    },
];

export default ConstantOrders;
