let find (a : int array) : int array =
    a |> Array.where( fun p -> p % 2 = 0 )
