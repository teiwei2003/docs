---
sidebar_position: 5
---

# Uploading and Interacting

We have the binary ready. Now it is time to see some wasm action. You can use [Go CLI](#go-cli) or
[Node Console](#node-console) as you wish.

## Go CLI {#go-cli}

We generated a wasm binary executable in the previous chapter. Let's upload the code to the blockchain. Once that is
complete, you can download the bytecode to verify it.

```shell
# see how many codes we have now
junod query wasm list-code $NODE

# now we store the bytecode on chain
# gas is huge due to wasm size... but auto-zipping reduced this from 1.8M to around 600k
# you can see the code in the result
RES=$(junod tx wasm store artifacts/cw_nameservice.wasm --from wallet $TXFLAG -y --output json)

# you can also get the code this way
CODE_ID=$(echo $RES | jq -r '.logs[0].events[-1].attributes[0].value')

# no contracts yet, this should return an empty list
junod query wasm list-contract-by-code $CODE_ID $NODE --output json

# you can also download the wasm from the chain and check that the diff between them is empty
junod query wasm code $CODE_ID $NODE download.wasm
diff artifacts/cw_nameservice.wasm download.wasm
```

### Instantiating the Contract {#instantiating-the-contract}

We can now create an instance of this wasm contract. Here we first instentiate the contract and make some query operations on it.

```shell
# instantiate contract and verify
INIT='{"purchase_price":{"amount":"100","denom":"ujunox"},"transfer_price":{"amount":"999","denom":"ujunox"}}'
junod tx wasm instantiate $CODE_ID "$INIT" \
    --from wallet --label "awesome name service" $TXFLAG -y

# check the contract state (and account balance)
junod query wasm list-contract-by-code $CODE_ID $NODE --output json
CONTRACT=$(junod query wasm list-contract-by-code $CODE_ID $NODE --output json | jq -r '.contracts[-1]')
echo $CONTRACT

# we should see this contract with 50000usponge
junod query wasm contract $CONTRACT $NODE
junod query bank balances $CONTRACT $NODE

# you can dump entire contract state
junod query wasm contract-state all $CONTRACT $NODE

# note that we prefix the key "config" with two bytes indicating its length
# echo -n config | xxd -ps
# gives 636f6e666967
# thus we have a key 0006636f6e666967

# you can also query one key directly
junod query wasm contract-state raw $CONTRACT 0006636f6e666967 $NODE --hex

# Note that keys are hex encoded, and val is base64 encoded.
# To view the returned data (assuming it is ascii), try something like:
# (Note that in many cases the binary data returned is non in ascii format, thus the encoding)
junod query wasm contract-state all $CONTRACT $NODE --output "json" | jq -r '.models[0].key' | xxd -r -ps
junod query wasm contract-state all $CONTRACT $NODE --output "json" | jq -r '.models[0].value' | base64 -d

# or try a "smart query", executing against the contract
junod query wasm contract-state smart $CONTRACT '{}' $NODE
# (since we didn't implement any valid QueryMsg, we just get a parse error back)
```

Once contract instantiated, let's register a name and transfer it with paying its price.

```shell
# execute fails if wrong person
REGISTER='{"register":{"name":"fred"}}'
junod tx wasm execute $CONTRACT "$REGISTER" \
    --amount 100ujunox \
    --from wallet $TXFLAG -y

# query name record
NAME_QUERY='{"resolve_record": {"name": "fred"}}'
junod query wasm contract-state smart $CONTRACT "$NAME_QUERY" $NODE --output json
# {"data":{"address":"juno1pze5wsf0dg0fa4ysnttugn0m22ssf3t4a9yz3h"}}

# buy and transfer name record to wallet2
TRANSFER='{"transfer":{"name":"fred","to":"juno15522nrwtvsf7mt2vhehhwuw9qpsxw2mghqzu50"}}'
junod tx wasm execute $CONTRACT "$TRANSFER" \
    --amount 999ujunox \
    --from wallet $TXFLAG -y
```

Query record to see the new owner address:

```shell
NAME_QUERY='{"resolve_record": {"name": "fred"}}'
junod query wasm contract-state smart $CONTRACT "$NAME_QUERY" $NODE --output json
# {"data":{"address":"juno15522nrwtvsf7mt2vhehhwuw9qpsxw2mghqzu50"}}
```
