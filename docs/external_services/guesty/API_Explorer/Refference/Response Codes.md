Response Codes

# Response Codes

## Response Codes

All APIs will respond with one of the following response codes:

<Table align={["left","left","left"]}>
  <thead>
    <tr>
      <th style={{ textAlign: "left" }}>
        Code
      </th>

      <th style={{ textAlign: "left" }}>
        Meaning
      </th>

      <th style={{ textAlign: "left" }}>
        Description
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td style={{ textAlign: "left" }}>
        200
      </td>

      <td style={{ textAlign: "left" }}>
        OK
      </td>

      <td style={{ textAlign: "left" }}>
        The request was successful
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        400
      </td>

      <td style={{ textAlign: "left" }}>
        Bad request
      </td>

      <td style={{ textAlign: "left" }}>
        Your request is invalid
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        401
      </td>

      <td style={{ textAlign: "left" }}>
        Unauthorized
      </td>

      <td style={{ textAlign: "left" }}>
        Your API key is wrong
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        403
      </td>

      <td style={{ textAlign: "left" }}>
        Forbidden
      </td>

      <td style={{ textAlign: "left" }}>
        The request is hidden for administrators only
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        404
      </td>

      <td style={{ textAlign: "left" }}>
        Not found
      </td>

      <td style={{ textAlign: "left" }}>
        Requested resource not found
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        429
      </td>

      <td style={{ textAlign: "left" }}>
        Too many requests
      </td>

      <td style={{ textAlign: "left" }}>
        The requests hit the rate limit. slow down and try again later
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        500
      </td>

      <td style={{ textAlign: "left" }}>
        Internal Server Error
      </td>

      <td style={{ textAlign: "left" }}>
        We had a problem with our server. Try again later.
      </td>
    </tr>
  </tbody>
</Table>