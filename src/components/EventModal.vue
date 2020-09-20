<template>
	<div class="custom-modal event-modal">
		<transition name="fade" mode="out-in">
			<BookingModal :seat="chosenSeat" :event="event" v-if="isBooking" @close-modal="closeBookingModal" />
		</transition>
		<div class="custom-modal__bg" @click="closeModal"></div>
		<div class="custom-modal__card">
			<button class="custom-modal__card__close" @click="closeModal"></button>
			<div class="custom-modal__card__content" v-if="event">
				<h2 class="custom-modal__card__title">{{ event.title }}</h2>
				<p class="custom-modal__card__desc">{{ event.description }}</p>
				<div class="custom-modal__card__date">
					<span class="custom-modal__card__date__title">Время проведения:</span>
					<span class="custom-modal__card__date__value">{{ event.startsAt | moment('HH:mm DD.MM.YY') }} ‒ {{ event.endsAt | moment('HH:mm DD.MM.YY') }}</span>
				</div>
				<div class="event-modal__booking">
					<div class="event-modal__booking__content" v-if="stands">
						<div class="event-modal__booking__row" v-for="row in rows" :key="row">
							<template v-if="stands[row-1]">
								<div class="event-modal__booking__item" v-for="seat in seatsPerRow" :key="`${row-1}-${seat-1}`" :class="{booked: !stands[row-1][seat-1]}" @click="openBookingModal(row-1, seat-1)">
									<span v-if="stands[row-1][seat-1]">{{ stands[row-1][seat-1].price }}₽</span>
								</div>
							</template>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: ['fullEvents', 'currentEventId'],

	components: {
		BookingModal: () => import('./BookingModal')
	},

	data() {
		return {
			seatsPerRow: 10,
			rows: 5,
			stands: [],
			fullEvent: null,
			chosenSeat: null,
			isBooking: false
		}
	},

	mounted() {
		this.fullEvent = this.fullEvents[this.currentEventId];
		if (this.fullEvent) {
			for (let i = 0; i < this.rows; i++) {
				this.stands[i] = [];
				for (let k = 0; k < this.seatsPerRow; k++) {
					this.stands[i][k] = this.fullEvent.stands.find(s => s.row_number-1 == i && s.seat_number-1 == k);
				}
			}
		}
	},

	computed: {
		event() {
			if (this.fullEvent) {
				return {
					title: this.fullEvent.title,
					description: this.fullEvent.description,
					startsAt: this.fullEvent.start_date,
					endsAt: this.fullEvent.end_date,
					id: this.fullEvent.id
				}
			}
		}
	},

	methods: {
		closeModal() {
			this.$emit('close-modal');
		},

		openBookingModal(row, seat) {
			if (this.stands && this.stands[row] && this.stands[row][seat]) {
				this.chosenSeat = this.stands[row][seat];
				this.isBooking = true;
			} else {
				this.$toasted.error('Это место уже забронировано', {position: 'top-center', duration: 3000});
			}
		},

		closeBookingModal() {
			this.isBooking = false;
			this.chosenSeat = null;
		}
	}
}
</script>
