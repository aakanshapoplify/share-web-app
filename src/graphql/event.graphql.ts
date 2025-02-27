import { gql } from "@apollo/client";

export const GET_EVENT = gql`
  query EventDetail($event_id: String!) {
    eventDetail(event_id: $event_id) {
      faqs {
        faq_id
        question
        answer
      }
      free
      price
      event_id
      status
      start_time
      end_time
      name
      waitlist_count
      can_join
      age
      slug
      description
      waitlist_count
      is_author_hidden
      image
      access_type
      free
      member_type
      online
      is_visible
      link
      location {
        name
        address
        latitude
        longitude
      }
      connected_account
      currency
      currency_symbol
      admins {
        user_id
        name
        username
        profile_picture
        email
      }
      organiser {
        user_id
        name
        email
        username
        profile_picture
      }
    }
  }
`;
export const GET_EVENT_DETAILS = gql`
  query EventTicketsStep($event_id: String!) {
    eventTicketsStep1(event_id: $event_id) {
      ticket_id
      name
      description
      price
      used
      selected
      quantity
      remaining
      terms
      currency
    }
  }
`;
export const ACTIONS_UPDATES = gql`
  query SelectTicketsStep2($selectedTicketInput: SelectedTicketInput) {
    selectTicketsStep2(selectedTicketInput: $selectedTicketInput) {
      event_id
      total
      currency_symbol
      booking_fee
      promo_code {
        value
        message
      }
      tickets {
        ticket_id
        name
        description
        price
        quantity
        used
        selected
        remaining
        terms
        currency
      }
      addons {
        event_addon_id
        question
        value
        mandatory
        active
        paid
        deleted
        field_type
        type
        ticket_ids
        options {
          addon_option_id
          name
          currency
          selected
          quantity
          price
          deleted
        }
      }
    }
  }
`;
