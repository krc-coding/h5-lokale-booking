export interface IBooking {
    id: number;
    title: string;
    description: string;
    start_time: Date;
    end_time: Date;
    user_id: number;
    room_id: number;
}
