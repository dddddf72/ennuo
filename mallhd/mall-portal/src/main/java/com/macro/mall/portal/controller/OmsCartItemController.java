package com.macro.mall.portal.controller;

import com.macro.mall.model.OmsCartItem;
import com.macro.mall.model.PmsSkuStock;
import com.macro.mall.model.UmsMember;
import com.macro.mall.portal.domain.CartProduct;
import com.macro.mall.portal.domain.CartPromotionItem;
import com.macro.mall.portal.domain.CommonResult;
import com.macro.mall.portal.service.OmsCartItemService;
import com.macro.mall.portal.service.PmsSkuStockService;
import com.macro.mall.portal.service.UmsMemberService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

/**
 * 购物车管理Controller
 * Created by macro on 2018/8/2.
 */
@Controller
@Api(tags = "OmsCartItemController", description = "购物车管理")
@RequestMapping("/cart")
public class OmsCartItemController {
    @Autowired
    private OmsCartItemService cartItemService;
    @Autowired
    private UmsMemberService memberService;

    @Autowired
    private PmsSkuStockService pmsSkuStockService;


    @ApiOperation("添加商品到购物车")
    @RequestMapping(value = "/addCart")
    @ResponseBody
    public Object addCart(@RequestParam(value = "id", defaultValue = "0") Long id,
                          @RequestParam(value = "count", defaultValue = "1") Integer count) {
        UmsMember umsMember = memberService.getCurrentMember();
        PmsSkuStock pmsSkuStock = pmsSkuStockService.selectById(id);
        if (pmsSkuStock != null && umsMember != null && umsMember.getId() != null) {
            OmsCartItem cartItem = new OmsCartItem();
            cartItem.setPrice(pmsSkuStock.getPrice());
            cartItem.setProductId(pmsSkuStock.getProductId());
            cartItem.setProductSkuCode(pmsSkuStock.getSkuCode());
            cartItem.setQuantity(count);
            cartItem.setProductSkuId(id);

            cartItem.setProductPic(pmsSkuStock.getPic());
            cartItem.setSp1(pmsSkuStock.getSp1());
            cartItem.setSp2(pmsSkuStock.getSp2());
            cartItem.setSp3(pmsSkuStock.getSp3());
            OmsCartItem omsCartItem = cartItemService.add(cartItem);
            return new CommonResult().success(omsCartItem.getId());

        }
        return new CommonResult().failed();
    }

    @ApiOperation("获取某个会员的购物车列表")
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    @ResponseBody
    public Object list() {
        UmsMember umsMember = memberService.getCurrentMember();
        if (umsMember != null && umsMember.getId() != null) {
            List<OmsCartItem> cartItemList = cartItemService.list(memberService.getCurrentMember().getId(), null);
            return new CommonResult().success(cartItemList);
        }
        return new ArrayList<OmsCartItem>();
    }

    @ApiOperation("获取某个会员的购物车列表,包括促销信息")
    @RequestMapping(value = "/list/promotion", method = RequestMethod.GET)
    @ResponseBody
    public Object listPromotion() {
        List<CartPromotionItem> cartPromotionItemList = cartItemService.listPromotion(memberService.getCurrentMember().getId(), null);
        return new CommonResult().success(cartPromotionItemList);
    }

    @ApiOperation("修改购物车中某个商品的数量")
    @RequestMapping(value = "/update/quantity", method = RequestMethod.GET)
    @ResponseBody
    public Object updateQuantity(@RequestParam Long id,
                                 @RequestParam Integer quantity) {
        int count = cartItemService.updateQuantity(id, memberService.getCurrentMember().getId(), quantity);
        if (count > 0) {
            return new CommonResult().success(count);
        }
        return new CommonResult().failed();
    }

    @ApiOperation("获取购物车中某个商品的规格,用于重选规格")
    @RequestMapping(value = "/getProduct/{productId}", method = RequestMethod.GET)
    @ResponseBody
    public Object getCartProduct(@PathVariable Long productId) {
        CartProduct cartProduct = cartItemService.getCartProduct(productId);
        return new CommonResult().success(cartProduct);
    }

    @ApiOperation("修改购物车中商品的规格")
    @RequestMapping(value = "/update/attr", method = RequestMethod.POST)
    @ResponseBody
    public Object updateAttr(@RequestBody OmsCartItem cartItem) {
        int count = cartItemService.updateAttr(cartItem);
        if (count > 0) {
            return new CommonResult().success(count);
        }
        return new CommonResult().failed();
    }

    @ApiOperation("删除购物车中的某个商品")
    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    @ResponseBody
    public Object delete(@RequestParam("ids") List<Long> ids) {
        int count = cartItemService.delete(memberService.getCurrentMember().getId(), ids);
        if (count > 0) {
            return new CommonResult().success(count);
        }
        return new CommonResult().failed();
    }

    @ApiOperation("清空购物车")
    @RequestMapping(value = "/clear", method = RequestMethod.POST)
    @ResponseBody
    public Object clear() {
        int count = cartItemService.clear(memberService.getCurrentMember().getId());
        if (count > 0) {
            return new CommonResult().success(count);
        }
        return new CommonResult().failed();
    }


}
